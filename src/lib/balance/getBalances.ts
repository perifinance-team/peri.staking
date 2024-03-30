import { contracts } from "lib/contract";

import { utils } from "ethers";

import { formatDecimal } from "lib";

import { tr } from "date-fns/locale";

import { getBalance } from "./getBalance";
export const getBalances = async (currentWallet, currencies, exchangeRates, targetCRatio, currentCRatio) => {
	const stakeAble: boolean = currentCRatio <= 25n * BigInt(Math.pow(10, 16).toString()); //0.25;

	const { PeriFinance, ExternalTokenStakeManager, RewardEscrowV2 } = contracts as any;

	const USDCDecimal = contracts.networkId === 56 ? 18 : currencies["USDC"].decimal;
	const DAIDecimal = currencies["DAI"].decimal;

	const [pUSDBalance, USDCBalance, DAIBalance, transferablePERI] = await Promise.all([
		await getBalance(currentWallet, "PynthpUSD", currencies["pUSD"].decimal),
		await getBalance(currentWallet, "USDC", USDCDecimal),
		await getBalance(currentWallet, "DAI", DAIDecimal),
		(async () => BigInt(await PeriFinance.transferablePeriFinance(currentWallet)))(),
	]);

	const [debtBalance, /*pUSDBalance, USDCBalance, DAIBalance, */ periBalance, /* transferablePERI, */ PERIRewardEscrow] = await Promise.all([
		(async () => BigInt(await PeriFinance.debtBalanceOf(currentWallet, utils.formatBytes32String("pUSD"))))(),
		/* await getBalance(currentWallet, "PynthpUSD", currencies["pUSD"].decimal), */
		/* await getBalance(currentWallet, "USDC", USDCDecimal),
		await getBalance(currentWallet, "DAI", DAIDecimal), */
		(async () => BigInt(await PeriFinance.collateral(currentWallet)))(),
		/* (async () => BigInt(await PeriFinance.transferablePeriFinance(currentWallet)))(), */
		(async () => BigInt(await RewardEscrowV2.balanceOf(currentWallet)))(),
	]);

	let USDCAllowance,
	DAIAllowance,
	LPAllowance = 0n;

	if (debtBalance > 0n) {
		USDCAllowance = formatDecimal(
			BigInt(
				(await contracts["USDC"].allowance(currentWallet, contracts?.addressList["ExternalTokenStakeManager"].address)).toString()
			),
			USDCDecimal
		);
	}

	if (debtBalance > 0n) {
		DAIAllowance = formatDecimal(
			BigInt(
				(await contracts["DAI"].allowance(currentWallet, contracts?.addressList["ExternalTokenStakeManager"].address)).toString()
			),
			DAIDecimal
		);
	}

	if (currentCRatio === 0n) {
		return noDebtBalances(currencies, currentWallet, pUSDBalance, USDCBalance, DAIBalance, periBalance, transferablePERI, PERIRewardEscrow, USDCAllowance, DAIAllowance);
	}

	// console.log("USDCBalance", USDCBalance.toString());
	// console.log("DAIBalance", DAIBalance.toString());

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

	let [stakedUSDC, stakedDAI] =
		debtBalance > 0n
			? await Promise.all([
					(async () =>
						BigInt(
							await ExternalTokenStakeManager.stakedAmountOf(
								currentWallet,
								utils.formatBytes32String("USDC"),
								utils.formatBytes32String("USDC")
							)
						))(),
					(async () =>
						BigInt(
							await ExternalTokenStakeManager.stakedAmountOf(
								currentWallet,
								utils.formatBytes32String("DAI"),
								utils.formatBytes32String("DAI")
							)
						))(),
			  ])
			: [0n, 0n, 0n, 0n, 0n];

	// console.log("stakedUSDC", stakedUSDC.toString());
	// console.log("stakedDAI", stakedDAI.toString());

	let usdcDebt,
		daiDebt,
		stableDEBT,
		periDebt,
		mintableStable,
		USDCStakeable,
		DAIStakeable,
		PERIStaked,
		PERIStakeable: bigint = 0n;

	try {
		usdcDebt =
			(BigInt(stakedUSDC) * exchangeRates["USDC"]) /
			BigInt(Math.pow(10, 18).toString()) /
			(BigInt(Math.pow(10, 18).toString()) / targetCRatio);
		daiDebt =
			(BigInt(stakedDAI) * exchangeRates["DAI"]) /
			BigInt(Math.pow(10, 18).toString()) /
			(BigInt(Math.pow(10, 18).toString()) / targetCRatio);
		stableDEBT = usdcDebt + daiDebt;
		periDebt = debtBalance - stableDEBT;

		mintableStable = periDebt / 4n - stableDEBT;
		mintableStable = mintableStable <= 0n ? 0n : mintableStable;

		// console.log("mintableStable", mintableStable.toString());
		USDCStakeable = currentCRatio !== 0n 
			? stakeAble
			? (mintableStable * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) * BigInt(Math.pow(10, 18).toString())) /
			  exchangeRates["USDC"]
			: 0n
			: USDCBalance;
		DAIStakeable = currentCRatio !== 0n 
			? stakeAble
			? (mintableStable * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) * BigInt(Math.pow(10, 18).toString())) /
			  exchangeRates["DAI"]
			: 0n
			: DAIBalance;

		// console.log("USDCStakeable", USDCStakeable.toString());
		// console.log("DAIStakeable", DAIStakeable.toString());

		if (USDCStakeable > USDCBalance) {
			USDCStakeable = USDCBalance;
		}

		if (DAIStakeable > DAIBalance) {
			DAIStakeable = DAIBalance;
		}

		PERIStaked =
			(periDebt * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) * BigInt(Math.pow(10, 18).toString())) /
			exchangeRates["PERI"];
		PERIStaked = periBalance < PERIStaked ? periBalance : PERIStaked;
		PERIStakeable = BigInt(periBalance) - PERIStaked;
		PERIStakeable = PERIStakeable <= 0n ? 0n : PERIStakeable;
	} catch (e) {
		console.log(e);
	}

	return {
		DEBT: {
			...currencies["DEBT"],
			balance: debtBalance,
			transferable: 0n,
			USDC: usdcDebt,
			DAI: daiDebt,
			PERI: periDebt,
			stable: stableDEBT,
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


const noDebtBalances = async (currencies, currentWallet, pUSDBalance, USDCBalance, DAIBalance, periBalance, transferablePERI, PERIRewardEscrow, USDCAllowance, DAIAllowance) => {

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
			stable: 0n,
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
			allowance: USDCAllowance,
		},
		DAI: {
			...currencies["DAI"],
			balance: DAIBalance,
			transferable: DAIBalance,
			staked: 0n,
			mintable: 0n,
			stakeable: DAIBalance,
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
