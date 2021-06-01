import numbro from 'numbro'
import { convertDecimal } from 'lib'

export const getBurnTransferAmount = ({amount, issuanceRatio, exchangeRates, target, decimal}) => {
    if(isNaN(Number(amount)) || amount === "") {
        amount = '0';
    }
    let retrunValue; 
    
    if(target === 'PERI') {
        retrunValue = numbro(amount).multiply(numbro(issuanceRatio).value()).multiply(numbro(exchangeRates['PERI']).value()).value().toString();
    } else if(target === 'USDC') {
        retrunValue = numbro(amount).multiply(numbro(issuanceRatio).value()).multiply(numbro(exchangeRates['USDC']).value()).value().toString();
    } else if(target === 'pUSD') {
        retrunValue = numbro(amount).divide(numbro(issuanceRatio).value()).divide(numbro(exchangeRates['PERI']).value()).value().toString();
    }

    return convertDecimal(convertDecimal, decimal)
    
}