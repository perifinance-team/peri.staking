import { getBurnTransferAmount } from 'lib'

import numbro from 'numbro';

export const getBurnMaxAmount = ({ balances, issuanceRatio, exchangeRates }) => {
    const pUSD = numbro(balances['pUSD']).value().toString();

    const PERI = getBurnTransferAmount({
        amount: numbro(balances['debt']), 
        issuanceRatio, 
        exchangeRates: exchangeRates['PERI'], 
        target: 'PERI'
    });
    
    const USDC = getBurnTransferAmount({
        amount: numbro(balances['USDC']), 
        issuanceRatio, 
        exchangeRates: exchangeRates['USDC'], 
        target: 'USDC'
    });
    const total = numbro(PERI).add(numbro(USDC).value());
    return {
        pUSD,
        PERI, 
        USDC,
        total 
    }
}