import numbro from 'numbro'
import { getCurrencyFormat } from 'lib'

export const getStakingAmount = ({ issuanceRatio, exchangeRates, mintingAmount }) => {
    issuanceRatio = numbro(issuanceRatio);
    mintingAmount = numbro(mintingAmount);
    exchangeRates = numbro(exchangeRates);

	if (!mintingAmount.value() || !issuanceRatio.value() || !exchangeRates.value()) return "0";
	const value = mintingAmount.divide(issuanceRatio).divide(exchangeRates);
    
    return getCurrencyFormat(value).toString();
}