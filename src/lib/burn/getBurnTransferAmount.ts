import numbro from 'numbro'

export const getBurnTransferAmount = ({amount, issuanceRatio, exchangeRates, target}) => {
    if(isNaN(Number(amount)) || amount === "") {
        amount = '0';
    }
    
    if(target === 'PERI') {
        return numbro(amount).multiply(numbro(issuanceRatio).value()).multiply(numbro(exchangeRates['PERI']).value()).value().toString();
    } else if(target === 'USDC') {
        return numbro(amount).multiply(numbro(issuanceRatio).value()).multiply(numbro(exchangeRates['USDC']).value()).value().toString();
    } else if(target === 'pUSD') {
        return numbro(amount).divide(numbro(issuanceRatio).value()).divide(numbro(exchangeRates['PERI']).value()).value().toString();
    }
    
}