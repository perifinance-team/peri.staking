import { utils } from 'ethers';
import { calculator, currencyToPynths } from 'lib'

import numbro from 'numbro';

export const getBurnMaxAmount = ({ balances, type, issuanceRatio, exchangeRates, staked }) => {
    let pUSD;
    if (numbro(balances['debt']).value() >= numbro(balances['pUSD']).value()) {
        if(type === 'PERI') {     
            const burnAblePERI = calculator(balances['PERITotal'], balances['transferablePERI'], 'sub');
            pUSD = currencyToPynths(burnAblePERI, issuanceRatio, exchangeRates['PERI']);
        } else if (type === 'USDC') {
            pUSD = currencyToPynths(staked['USDC'], issuanceRatio, exchangeRates['USDC']);
        } else {
            pUSD = balances['pUSD'];
        }
    } else {
        pUSD = balances['debt'];
    }

    const USDC = '0.000000';
    
    return {
        pUSD: utils.formatEther(pUSD),
        USDC,
    }
}