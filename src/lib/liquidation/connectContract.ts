import { utils } from "ethers";
import { formatCurrency } from "lib/format";

const ratioToPer = (value) => {
	if (value === 0n) return "0";
	return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
};

export const connectContract = async (
	address: string,
	PeriFinance: any,
	Liquidations: any,
	contracts: any
) => {
	const debt = BigInt(
		await PeriFinance.debtBalanceOf(address, utils.formatBytes32String("pUSD"))
	);

	if (debt === 0n) {
		return false;
	}

	const cRatio = BigInt(
		(await PeriFinance.collateralisationRatio(address)).toString()
	);

	const daiKey =
		"0x4441490000000000000000000000000000000000000000000000000000000000";
	const usdcKey =
		"0x5553444300000000000000000000000000000000000000000000000000000000";

	const collaterial = { pUSD: {}, USDC: 0, DAI: 0 };

	const tempPUSD = async () => {
		const staked =
			formatCurrency(await PeriFinance.collateral(address)).replace(",", "") -
			formatCurrency(
				await PeriFinance.transferablePeriFinance(address)
			).replace(",", "");

		const stake =
			BigInt(await PeriFinance.collateral(address)) -
			BigInt(await PeriFinance.transferablePeriFinance(address));

		return { staked: staked, stake: stake };
	};

	const tempUSDC = async () => {
		return await contracts.ExternalTokenStakeManager.stakedAmountOf(
			address,
			usdcKey,
			usdcKey
		);
	};
	const tempDAI = async () => {
		return await contracts.ExternalTokenStakeManager.stakedAmountOf(
			address,
			daiKey,
			daiKey
		);
	};

	await tempPUSD().then((data) => (collaterial.pUSD = data));
	await tempUSDC().then((data) => (collaterial.USDC = data));
	await tempDAI().then((data) => (collaterial.DAI = data));

	const status = async () => {
		if (
			(await Liquidations.isOpenForLiquidation(address)) &&
			Number(ratioToPer(cRatio)) <= 150
		) {
			return 0;
		} else if (false) {
			// todo taken
			return 1;
		} else {
			return 2;
		}
	};

	let resultData;

	await status().then((data) => (resultData = data));

	return {
		cRatio: cRatio,
		debt: debt,
		collateral: [
			{
				name: "Peri",
				value: collaterial.pUSD,
			},
			{ name: "Dai", value: collaterial.DAI },
			{ name: "USDC", value: collaterial.USDC },
		],
		status: resultData,
		address: address,
	};
};
