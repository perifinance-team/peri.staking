import numbro from 'numbro'
import { getCurrencyFormat } from 'lib'

export const getEstimateCRatio = ({ PERITotalBalance, debtBalanceOf, exchangeRates, mintingAmount, stakedAmount, stakingAmount }) => {
    PERITotalBalance = numbro(PERITotalBalance);
    debtBalanceOf = numbro(debtBalanceOf);
    exchangeRates['PERI'] = numbro(exchangeRates['PERI']);
    mintingAmount = numbro(mintingAmount);

	if (!PERITotalBalance.value() || !debtBalanceOf.value() || !exchangeRates['PERI'].value()) {
		return "0";
	}
	
	const PERItopUSDRates = PERITotalBalance.multiply(exchangeRates['PERI']); //pUSD

	const USDCtopUSDRates = numbro(stakedAmount).clone().add(numbro(stakingAmount).value()).multiply(exchangeRates['USDC']); //pUSD
	const value = PERItopUSDRates.add(USDCtopUSDRates).divide((debtBalanceOf.add(mintingAmount))).multiply(100);
	return isNaN(Number(value)) ? '0.00' : getCurrencyFormat(value);
}