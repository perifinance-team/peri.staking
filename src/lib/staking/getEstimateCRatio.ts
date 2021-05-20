import numbro from 'numbro'
import { getCurrencyFormat } from 'lib'

export const getEstimateCRatio = ({ PERIBalance, debtBalanceOf, exchangeRates, mintingAmount }) => {
    PERIBalance = numbro(PERIBalance);
    debtBalanceOf = numbro(debtBalanceOf);
    exchangeRates['PERI'] = numbro(exchangeRates['PERI']);
    mintingAmount = numbro(mintingAmount);

	if (!PERIBalance.value() || !debtBalanceOf.value() || !exchangeRates['PERI'].value()) {
		return "0";
	}

	const pUSDRates = PERIBalance.multiply(exchangeRates['PERI']);
	const value = getCurrencyFormat(pUSDRates.divide((debtBalanceOf.add(mintingAmount))).multiply(100));
	return value;
}