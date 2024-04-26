import { contracts } from "lib/contract";

import { utils } from "ethers";

import { formatDecimal } from "lib";
import { divideDecimal, multiplyDecimal, toBytes32 } from "lib/etc/utils";

import { getLPBalance } from "./getLPBalance";
import { getDebtNAddableAmt } from "./getStakableAmt";

const getPeriBalance = async (
  currentWallet: bigint,
  exTokens: any,
  stableEA: bigint,
  goldEA: bigint,
  periIR: bigint,
  periBalance: bigint,
  debtBalance: bigint,
  exchangeRates: any
) => {
  let periDebt: bigint,
    PERIStaked: bigint,
    PERIStakeable: bigint = 0n;

  const { RewardEscrowV2, PeriFinance } = contracts as any;

  let PERIRewardEscrow = 0n,
    transferablePERI = 0n,
    periEA = 0n;
  if (periBalance > 0) {
    [PERIRewardEscrow, transferablePERI] = (
      await Promise.all([
        RewardEscrowV2.balanceOf(currentWallet),
        PeriFinance.transferablePeriFinance(currentWallet),
      ])
    ).map((item) => BigInt(item));
    periEA = multiplyDecimal(periBalance, exchangeRates["PERI"]);
  }
  const totalEA = periEA + stableEA + goldEA;

  try {
    periDebt = debtBalance - exTokens["DEBT"].exDebt;
    PERIStaked =
      periDebt === 0n
        ? 0n
        : divideDecimal(periDebt, multiplyDecimal(periIR, exchangeRates["PERI"]));
    PERIStaked = periBalance < PERIStaked ? periBalance : PERIStaked;
    PERIStakeable = BigInt(periBalance) - PERIStaked;
    PERIStakeable = PERIStakeable <= 0n ? 0n : PERIStakeable;
  } catch (e) {
    console.log(e);
  }

  exTokens["PERI"] = {
    ...exTokens["PERI"],
    balance: periBalance,
    transferable: transferablePERI,
    rewardEscrow: PERIRewardEscrow,
    staked: PERIStaked,
    stakeable: PERIStakeable,
    totalEA: totalEA,
  };

  return periDebt;
};

const setExBalances = async (
  currentWallet,
  currencies,
  exTokens,
  currentCRatio,
  exchangeRates,
  iRatios
) => {
  const { PeriFinance, RewardEscrowV2, PynthpUSD, ExternalTokenStakeManager, LPContract } =
    contracts as any;
  const [, stableIR, goldIR] = iRatios;

  // console.log("LPContract", LPContract);

  const [pUSDB, periB, debtB, exTokenInfo, LP] = await Promise.all([
    PynthpUSD.balanceOf(currentWallet),
    PeriFinance.collateral(currentWallet),
    PeriFinance.debtBalanceOf(currentWallet, toBytes32("pUSD")),
    ExternalTokenStakeManager.tokenStakeStatus(currentWallet),
    getLPBalance(currentWallet, currencies),
  ]);

  const [pUSDBalance, periBalance, debtBalance] = [BigInt(pUSDB), BigInt(periB), BigInt(debtB)];
  const { tokenList, stakedAmts, decimals, balances } = exTokenInfo;

  let stableEA: bigint = 0n,
    goldEA: bigint = 0n;
  const stables = Object.keys(currencies)
    .filter((item) => currencies[item]?.stable)
    .map((item) => item);

  const promise = tokenList.map(async (token, index) => {
    const tokenName = utils.parseBytes32String(token);
    const iDecimals = Number(decimals[index]);

    const staked = BigInt(stakedAmts[index]);
    const balance = BigInt(balances[index]);
    console.log("tokenName", tokenName, "staked", staked, "balance", balance);
    // get allowance of all external tokens
    const tokenContract = contracts[tokenName];
    let allowance = 0n;
		try {
			allowance = currentCRatio > 0n && tokenContract
	        ? formatDecimal(
	            BigInt(
	              await tokenContract.allowance(
	                currentWallet,
	                contracts?.addressList["ExternalTokenStakeManager"].address
	              )
	            ),
	            iDecimals
	          )
	        : 0n;
		} catch (err) {
			console.log("allowance error", tokenName, err);
		}

    // copy exisiting token's data
    exTokens[tokenName] = {
      ...currencies[tokenName],
      staked: staked,
      decimal: iDecimals,
      transferable: balance,
      balance: balance + staked,
      stakeable: balance,
      allowance: allowance,
    };
    // console.log("tokenName", tokenName, "staked", exTokens[tokenName].staked);

    if (!["DEBT", "PERI", "pUSD", "LP"].includes(tokenName)) {
      const tokenEA = multiplyDecimal(staked, exchangeRates[tokenName]);
      let IR = 0n;
      if (stables.includes(tokenName)) {
        stableEA = stableEA + tokenEA;
        IR = stableIR;
      } else {
        goldEA = goldEA + tokenEA;
        IR = goldIR;
      }
      exTokens[tokenName]["IR"] = IR;
      // init exToken's DEBT
      exTokens["DEBT"][tokenName] = multiplyDecimal(tokenEA, IR);
      exTokens["DEBT"]["exDebt"] += exTokens["DEBT"][tokenName];
    }
    // console.log(token, "staked", tokens[token].staked, "exchangeRates", exchangeRates[token]);
  });

  LP && (exTokens["LP"] = LP);
  exTokens["pUSD"] = { ...currencies["pUSD"], balance: pUSDBalance, transferable: pUSDBalance };
  let PERIRewardEscrow = 0n,
    transferablePERI = 0n,
    periEA = 0n;
  if (periBalance > 0) {
    const [escrow, transferables] = await Promise.all([
      RewardEscrowV2.balanceOf(currentWallet),
      PeriFinance.transferablePeriFinance(currentWallet),
    ]);

    [PERIRewardEscrow, transferablePERI] = [escrow, transferables].map((item) => BigInt(item));

    periEA = multiplyDecimal(periBalance, exchangeRates["PERI"]);
  }
  exTokens["PERI"] = {
    ...exTokens["PERI"],
    balance: periBalance,
    transferable: periBalance - PERIRewardEscrow,
    rewardEscrow: PERIRewardEscrow,
    stakeable: periBalance,
    totalEA: periEA + stableEA + goldEA,
  };

  await Promise.all(promise);

  // console.log("exTokens", exTokens);

  return { stableEA, goldEA, stables, periBalance, debtBalance, transferablePERI, LP };
};

const getIRatios = async () => {
  // return ['0.25', '1', '0.75', '0.5'].map(toBigInt);
  const { SystemSettings } = contracts as any;
  const ratios = await Promise.all([
    SystemSettings.issuanceRatio(),
    SystemSettings.exTokenIssuanceRatio(toBytes32("USDC")),
    SystemSettings.exTokenIssuanceRatio(toBytes32("XAUT")),
    SystemSettings.externalTokenQuota(),
  ]);

  return ratios.map((item) => item.toBigInt());
};

export const getBalances = async (currentWallet, currencies, exchangeRates, currentCRatio) => {
  // const { ExternalTokenStakeManager } = contracts as any;

  const exTokens = {};
  /* const [ iRatios, exTokenInfo, LP ] = await Promise.all([
		getIRatios(),
		ExternalTokenStakeManager.tokenStakeStatus(currentWallet), 
		getLPBalance(currentWallet, currencies)
	]); */

  const iRatios = await getIRatios();

  const [periIR, stableIR, goldIR, maxTR] = iRatios;

  exTokens["DEBT"] = { ...currencies["DEBT"], balance: 0n, transferable: 0n, PERI: 0n, exDebt: 0n };
  exTokens["PERI"] = {
    ...currencies["PERI"],
    balance: 0n,
    transferable: 0n,
    rewardEscrow: 0n,
    staked: 0n,
    stakeable: 0n,
    IR: periIR,
    totalEA: 0n,
  };

  const { stableEA, goldEA, stables, periBalance, debtBalance, transferablePERI } =
    await setExBalances(currentWallet, currencies, exTokens, currentCRatio, exchangeRates, iRatios);

  // const periDebt = await getPeriBalance(currentWallet, exTokens, stableEA, goldEA, periIR, periBalance, debtBalance, exchangeRates);

  // console.log("getting debt and addable amounts");
  currentCRatio &&
    (await getDebtNAddableAmt(
      exTokens,
      exchangeRates,
      debtBalance,
      stableEA,
      goldEA,
      stableIR,
      goldIR,
      maxTR,
      stables
    ));

  if (currentCRatio === 0n) {
    return exTokens;
  }

  let periDebt: bigint,
    PERIStaked: bigint,
    PERIStakeable: bigint = 0n;

  try {
    periDebt = debtBalance - exTokens["DEBT"].exDebt;
    PERIStaked =
      periDebt === 0n
        ? 0n
        : divideDecimal(periDebt, multiplyDecimal(periIR, exchangeRates["PERI"]));
    PERIStaked = periBalance < PERIStaked ? periBalance : PERIStaked;
    PERIStakeable = BigInt(periBalance) - PERIStaked;
    PERIStakeable = PERIStakeable <= 0n ? 0n : PERIStakeable;
  } catch (e) {
    console.log(e);
  }

  exTokens["PERI"] = {
    ...exTokens["PERI"],
    transferable: transferablePERI,
    staked: PERIStaked,
    stakeable: PERIStakeable,
  };

  exTokens["DEBT"].balance = debtBalance;
  exTokens["DEBT"].PERI = periDebt;

  return exTokens;
};
/* 
	return {
		DEBT: {
			...currencies["DEBT"],
			balance: debtBalance,
			transferable: 0n,
			USDC: usdcDebt,
			DAI: daiDebt,
			PERI: periDebt,
			exDebt: stableDEBT,
		},
		PERI: {
			...currencies["PERI"],
			balance: periBalance,
			staked: PERIStaked,
			stakeable: PERIStakeable,
			transferable: transferablePERI,
			rewardEscrow: PERIRewardEscrow,
		},
		pUSD: {
			...currencies["pUSD"],
			balance: pUSDBalance,
			transferable: pUSDBalance,
		},
		USDC: {
			...currencies["USDC"],
			balance: USDCBalance + stakedUSDC,
			transferable: USDCBalance,
			staked: stakedUSDC,
			stakeable: USDCStakeable,
			mintable: stakeAble ? mintableStable : 0n,
			allowance: USDCAllowance,
		},
		DAI: {
			...currencies["DAI"],
			balance: DAIBalance + stakedDAI,
			transferable: DAIBalance,
			staked: stakedDAI,
			mintable: stakeAble ? mintableStable : 0n,
			stakeable: DAIStakeable,
			allowance: DAIAllowance,
		},
		LP: {
			...currencies["LP"],
			balance: LPBalance + stakedLP,
			transferable: LPBalance,
			allowance: LPAllowance,
			staked: stakedLP,
			stakeable: LPBalance,
			rewardEscrow: LPRewardEscrow,
		},
	};
};
 */
