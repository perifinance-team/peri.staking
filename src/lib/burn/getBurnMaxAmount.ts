import { getBurnTransferAmount } from 'lib'

import numbro from 'numbro';

export const getBurnMaxAmount = ({ pUSDBalance, PERIDebtpUSD, USDCDebtpUSD, issuanceRatio, exchangeRates }) => {
    const pUSD = numbro(pUSDBalance);

    const PERI = getBurnTransferAmount({
        amount: numbro(PERIDebtpUSD), 
        issuanceRatio, 
        exchangeRates: exchangeRates['PERI'], 
        target: 'PERI'
    });
    
    const USDC = getBurnTransferAmount({
        amount: numbro(USDCDebtpUSD), 
        issuanceRatio, 
        exchangeRates: exchangeRates['USDC'], 
        target: 'USDC'
    });
    const total = PERI.add(USDC.value());
    return {
        pUSD,
        PERI, 
        USDC,
        total 
    }
}