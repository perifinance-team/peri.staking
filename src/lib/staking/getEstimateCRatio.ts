import numbro from 'numbro'
import { getCurrencyFormat } from 'lib'

export const getEstimateCRatio = ({ PERITotalBalance, debtBalanceOf, exchangeRates, mintingAmount}) => {
    PERITotalBalance = numbro(PERITotalBalance);
    debtBalanceOf = numbro(debtBalanceOf);
    exchangeRates['PERI'] = numbro(exchangeRates['PERI']);
    mintingAmount = numbro(mintingAmount);

	if (!PERITotalBalance.value() || !debtBalanceOf.value() || !exchangeRates['PERI'].value()) {
		return "0";
	}

	const USDCtopPERIRates = numbro(PERITotalBalance).multiply(exchangeRates['PERI'].value());
	
	const value = (debtBalanceOf.add(mintingAmount)).divide((USDCtopPERIRates));

	return isNaN(Number(value)) ? '0.00' : Math.round(Number(numbro(100).divide(value).format({mantissa: 2}))).toString();
}