import { contracts } from "lib/contract";
import { getBalance } from "./getBalance";

export const getLPBalance = async (currentWallet:string, currencies:any) => {
	
	const [LPBalance, LPRewardEscrow, stakedLP] = contracts["LP"]
		? await Promise.all([
				await getBalance(currentWallet, "LP", currencies["LP"].decimal),
				(async () => BigInt(await contracts["LP"].earned(currentWallet)))(),
				(async () => BigInt(await contracts["LP"].stakedAmountOf(currentWallet)))(),
		  ])
		: [0n, 0n, 0n];

	const LPAllowance = LPBalance > 0n ? BigInt((await contracts["LP"].allowance(currentWallet)).toString()) : 0n;

	return { ...currencies["LP"],
		balance: LPBalance + stakedLP,
		transferable: LPBalance,
		allowance: LPAllowance,
		staked: stakedLP,
		stakeable: LPBalance,
		rewardEscrow: LPRewardEscrow,
	}

};