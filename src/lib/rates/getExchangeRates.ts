import { contracts } from 'lib/contract'
import { utils } from 'ethers';

export const getExchangeRates = async () => {
    const {
        ExchangeRates,
	} = contracts as any;

    const PERI = BigInt((await ExchangeRates.rateForCurrency(utils.formatBytes32String('PERI'))).toString());
    console.log(PERI);
    const USDC = BigInt((await ExchangeRates.rateForCurrency(utils.formatBytes32String('USDC'))).toString());
    console.log(USDC);
    const DAI = BigInt((await ExchangeRates.rateForCurrency(utils.formatBytes32String('DAI'))).toString());
    console.log(DAI);
    return {
        PERI,
        USDC,
        DAI
    }
}