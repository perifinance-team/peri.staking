import { utils } from 'ethers'

export const currencyToPynths = (amount, issuanceRatio, exchangeRates) => {
    if(isNaN(Number(amount)) || amount === "") {
        amount = '0';
    }
    
    amount = typeof amount === "string" ? utils.parseEther(amount) : amount;
    issuanceRatio = typeof issuanceRatio === "string" ? utils.parseEther(issuanceRatio) : issuanceRatio;
    exchangeRates = typeof exchangeRates === "string" ? utils.parseEther(exchangeRates) : exchangeRates;
    if(
        amount.eq(utils.parseEther('0'))
    )  {
        return utils.parseEther('0');
    }

    return (amount).mul(exchangeRates).div(issuanceRatio).mul(100);
}