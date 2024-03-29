import { contracts } from "lib/contract";

import { utils } from "ethers";

import { formatDecimal } from "lib";
import { getBalance } from "./getBalance";

import { getDebtNAddableAmt } from "./getStakableAmt";
import { getLPBalance } from "./getLPBalance";

export const getBalances = async (currentWallet, currencies, exchangeRates, currentCRatio) => {
	// const stakeAble: boolean = currentCRatio <= 25n * BigInt(Math.pow(10, 16).toString()); //0.25;
	// const stakeAble: boolean = currentCRatio <= targetCRatio;

	const { PeriFinance, ExternalTokenStakeManager, RewardEscrowV2 } = contracts as any;

	const exTokens = {};
	const { tokenList, stakedAmts, decimals } = await ExternalTokenStakeManager.tokenStakeStatus(currentWallet);
	for (let i = 0; i < tokenList.length; i++) {
		const tokenName = utils.parseBytes32String(tokenList[i]);
		exTokens[tokenName] = { ...currencies[tokenName], staked: stakedAmts[i] };
		exTokens[tokenName].decimal = decimals[i];
	}
	await Promise.all(Object.keys(exTokens).map((token) => {
		exTokens[token].balance = (async () => BigInt(await getBalance(currentWallet, token, currencies[token].decimal)));
		const tokenContract = contracts[token];
		exTokens[token].allowance = currentCRatio > 0n && tokenContract
			? (async () => formatDecimal(
				BigInt(await tokenContract.allowance(currentWallet, contracts?.addressList["ExternalTokenStakeManager"].address)),
				exTokens[token].decimal
				))
			: 0n;

		return exTokens[token];
	}));

	exTokens["DEBT"] = {balance: 0n, transferable: 0n, PERI: 0n};
	const periIR = await contracts.SystemSettings.issuanceRatio();
	await getDebtNAddableAmt(exTokens, periIR, currentCRatio);

	const [pUSDBalance, periBalance] = await Promise.all([
		await getBalance(currentWallet, "PynthpUSD", currencies["pUSD"].decimal),
		(async () => BigInt(await PeriFinance.collateral(currentWallet)))(),
	]);

	const [transferablePERI, PERIRewardEscrow] = periBalance > 0 
		? await Promise.all([
				(async () => BigInt(await PeriFinance.transferablePeriFinance(currentWallet)))(),
				(async () => BigInt(await RewardEscrowV2.balanceOf(currentWallet)))(),
			])
		: [0n, 0n];

	exTokens["pUSD"] = { ...currencies["pUSD"], balance: pUSDBalance, transferable: pUSDBalance };
	exTokens["PERI"] = { ...currencies["PERI"], balance: periBalance, transferable: transferablePERI, rewardEscrow: PERIRewardEscrow };

	exTokens["LP"] = await getLPBalance(currentWallet, currencies);

	if (currentCRatio === 0n) {
		return exTokens;
	}

	const debtBalance = BigInt(await PeriFinance.debtBalanceOf(currentWallet, utils.formatBytes32String("pUSD")));


	let periDebt: bigint, PERIStaked: bigint, PERIStakeable: bigint = 0n;

	try {
		periDebt = debtBalance - exTokens["DEBT"].exDebt;
		PERIStaked =
			(periDebt * (BigInt(Math.pow(10, 18).toString()) / periIR) * BigInt(Math.pow(10, 18).toString())) /
			exchangeRates["PERI"];
		PERIStaked = periBalance < PERIStaked ? periBalance : PERIStaked;
		PERIStakeable = BigInt(periBalance) - PERIStaked;
		PERIStakeable = PERIStakeable <= 0n ? 0n : PERIStakeable;
	} catch (e) {
		console.log(e);
	}

	exTokens["DEBT"].balance = debtBalance;
	exTokens["PERI"] = 
		{...exTokens["PERI"], staked: PERIStaked, stakeable: PERIStakeable}
	
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

const noDebtBalances = async (currencies, currentWallet, pUSDBalance, USDCBalance, DAIBalance, periBalance, transferablePERI, PERIRewardEscrow) => {
	let LPAllowance = 0n;
	
	let [LPBalance, LPRewardEscrow, stakedLP] = contracts["LP"]
		? await Promise.all([
				await getBalance(currentWallet, "LP", currencies["LP"].decimal),
				(async () => BigInt(await contracts["LP"].earned(currentWallet)))(),
				(async () => BigInt(await contracts["LP"].stakedAmountOf(currentWallet)))(),
		  ])
		: [0n, 0n, 0n];

	if (LPBalance > 0n) {
		LPAllowance = contracts["LP"] ? BigInt((await contracts["LP"].allowance(currentWallet)).toString()) : 0n;
	}
	
	return {
		DEBT: {
			...currencies["DEBT"],
			balance: 0n,
			transferable: 0n,
			USDC: 0n,
			DAI: 0n,
			PERI: 0n,
			exDebt: 0n,
		},
		PERI: {
			...currencies["PERI"],
			balance: periBalance,
			staked: 0n,
			stakeable: periBalance,
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
			balance: USDCBalance,
			transferable: USDCBalance,
			staked: 0n,
			stakeable: USDCBalance,
			mintable: 0n,
			allowance: 0n,
		},
		DAI: {
			...currencies["DAI"],
			balance: DAIBalance,
			transferable: DAIBalance,
			staked: 0n,
			mintable: 0n,
			stakeable: DAIBalance,
			allowance: 0n,
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