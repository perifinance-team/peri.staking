import numbro from 'numbro'
import { getCurrencyFormat } from 'lib'

export const getEstimateCRatio = ({ PERIBalance, balanceOf, exchangeRates, mintingAmount }) => {
    PERIBalance = numbro(PERIBalance);
    balanceOf = numbro(balanceOf);
    exchangeRates = numbro(exchangeRates);
    mintingAmount = numbro(mintingAmount);

	if (PERIBalance.value() || balanceOf.value() || exchangeRates.value()) {
		return "0";
	}

	const pUSDRates = PERIBalance.multiply(exchangeRates);
	const value = getCurrencyFormat(pUSDRates.divide((balanceOf.add(mintingAmount))).multiply(10));
	return value;
}