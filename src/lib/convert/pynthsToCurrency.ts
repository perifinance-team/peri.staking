import { utils } from 'ethers'

export const pynthsToCurrency = (amount, issuanceRatio, exchangeRates) => {
    amount = typeof amount === "string" ? utils.parseEther(amount) : amount;
    issuanceRatio = typeof amount === "string" ? utils.parseEther(issuanceRatio) : issuanceRatio;
    exchangeRates = typeof amount=== "string" ? utils.parseEther(exchangeRates) : exchangeRates;
    return (amount).mul(issuanceRatio).div(exchangeRates).div(100);
}