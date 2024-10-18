// import { end, start } from 'lib/performance';
import { getExchangeRates } from './getExchangeRates'
import { getIssuanceRatio } from './getIssuanceRatio'
import { getLiquidationRatio } from './getLiquidationRatio'


export const getRatios = async (currentWallet, nativeCoin) => {
    // start("getRatios");
    const [iRatios, lRatios, exchangeRates ] = await Promise.all([
        getIssuanceRatio(currentWallet),
        getLiquidationRatio(currentWallet),
        getExchangeRates(nativeCoin)
    ])
    // end();
    // console.log("iRatios", iRatios);
    // const { tRatio, cRatio, exSR, maxSR } = await getIssuanceRatio(currentWallet)
    return {
        exchangeRates: exchangeRates,
        ratio: {
            currentCRatio: BigInt(iRatios.cRatio),
            targetCRatio: BigInt(iRatios.tRatio),
            liquidationRatio: BigInt(lRatios),
            exStakingRatio: BigInt(iRatios.exSR),
            maxStakingRatio: BigInt(iRatios.maxSR),
        }
    }
}