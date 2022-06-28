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

	if (debt === 0n || formatCurrency(debt) === "0") {
		return false;
	}

	const cRatio = BigInt(
		(await PeriFinance.collateralisationRatio(address)).toString()
	);

	const daiKey = utils.formatBytes32String("DAI");
	const usdcKey = utils.formatBytes32String("USDC");

	const collateral = { pUSD: 0, USDC: 0, DAI: 0 };

	const tempPUSD = async () => {
		return await PeriFinance.collateral(address);
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

	collateral.pUSD = await tempPUSD();
	collateral.USDC = await tempUSDC();
	collateral.DAI = await tempDAI();

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

	let resultData = await status();

	return {
		cRatio: cRatio,
		debt: debt,
		collateral: [
			{
				name: "Peri",
				value: collateral.pUSD,
			},
			{ name: "Dai", value: collateral.DAI },
			{ name: "USDC", value: collateral.USDC },
		],
		status: resultData,
		address: address,
	};
};
