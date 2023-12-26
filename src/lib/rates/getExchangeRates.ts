import { contracts } from "lib/contract";
import { utils } from "ethers";

export const getExchangeRates = async () => {
	const { ExchangeRates } = contracts as any;

	if (!ExchangeRates) {
		return {
			PERI: BigInt(0),
			USDC: BigInt(0),
			DAI: BigInt(0),
		};
	}

	// console.log("ExchangeRates", ExchangeRates);
	const PERI = BigInt((await ExchangeRates.rateForCurrency(utils.formatBytes32String("PERI"))).toString());
	const USDC = BigInt((await ExchangeRates.rateForCurrency(utils.formatBytes32String("USDC"))).toString());
	const DAI = BigInt((await ExchangeRates.rateForCurrency(utils.formatBytes32String("DAI"))).toString());

	return {
		PERI,
		USDC,
		DAI,
	};
};
