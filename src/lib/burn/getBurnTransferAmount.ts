import numbro from 'numbro'
import { pynthsToCurrency, currencyToPynths } from 'lib'
import { utils } from 'ethers';

export const getBurnTransferAmount = ({amount, issuanceRatio, exchangeRates, target}) => {
    if(isNaN(Number(amount)) || amount === "") {
        amount = '0';
    }
    let retrunValue; 
    
    if(target === 'PERI') {
        retrunValue = currencyToPynths(amount, issuanceRatio, exchangeRates['PERI']);
    } else if(target === 'USDC') {
        retrunValue = currencyToPynths(amount, issuanceRatio, exchangeRates['USDC']);
    } else if(target === 'pUSD') {
        retrunValue = pynthsToCurrency(amount, issuanceRatio, exchangeRates['PERI'])
    }

    return utils.formatEther(retrunValue);
    
}