import { pynthsToCurrency, currencyToPynths, calculator } from 'lib'
import { utils } from 'ethers';

export const getBurnTransferAmount = ({amount, issuanceRatio, exchangeRates, target, PERIQuota}) => {
    if(isNaN(Number(amount)) || amount === "") {
        amount = '0';
    }
    let retrunValue; 
    
    if(target === 'PERI') {
        retrunValue = currencyToPynths(amount, issuanceRatio, exchangeRates['PERI']);
    } else if(target === 'USDC') {
        retrunValue = currencyToPynths(amount, issuanceRatio, exchangeRates['USDC']);
    } else if(target === 'pUSD') {
        const unLockAmount = calculator(amount, PERIQuota, 'sub');
        if(utils.bigNumberify('0').lt(unLockAmount)) {
            retrunValue = pynthsToCurrency(unLockAmount, issuanceRatio, exchangeRates['PERI'])    
        } else {
            retrunValue = currencyToPynths('0', issuanceRatio, exchangeRates['PERI']);
        }
        
    }

    return utils.formatEther(retrunValue);
    
}