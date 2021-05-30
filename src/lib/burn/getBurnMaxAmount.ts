import { getBurnTransferAmount } from 'lib'

import numbro from 'numbro';

export const getBurnMaxAmount = ({ balances, type, issuanceRatio, exchangeRates, staked }) => {
    let pUSD;
    if (numbro(balances['debt']).value() >= numbro(balances['pUSD']).value()) {
        if(type === 'PERI') {
            const burnAblePERI = numbro(balances['PERITotal']).subtract(numbro(balances['transferablePERI']).value()) 
            pUSD = burnAblePERI.multiply(issuanceRatio).multiply(exchangeRates['PERI']).format({mantissa: 6})
        } else if (type === 'USDC') {
            const burnAbleUSDC = numbro(staked['USDC']);
            pUSD = burnAbleUSDC.multiply(issuanceRatio).multiply(exchangeRates['USDC']).format({mantissa: 6})
        } else {
            pUSD = balances['pUSD'];
        }
    } else {
        pUSD = balances['debt'];
    }
    
    const USDC = '0.000000';
    
    return {
        pUSD,
        USDC,
    }
}