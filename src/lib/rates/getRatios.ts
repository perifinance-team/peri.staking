import { getCurrentCRatio } from './getCurrentCRatio'
import { getExchangeRates } from './getExchangeRates'
import { getIssuanceRatio } from './getIssuanceRatio'
import { getLiquidationRatio } from './getLiquidationRatio'


export const getRatios = async (currentWallet) => {
    return {
        exchangeRates: await getExchangeRates(),
        ratio: {
            currentCRatio: await getCurrentCRatio(currentWallet),
            targetCRatio: await getIssuanceRatio(),
            liquidationRatio: await getLiquidationRatio(),
        }
    }
}