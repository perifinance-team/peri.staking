import numbro from 'numbro'

export const getStakingEstimateCRatio = ({ PERITotalBalance, debtBalanceOf, exchangeRates, mintingAmount, stakingAmount}) => {
    PERITotalBalance = numbro(PERITotalBalance);
    debtBalanceOf = numbro(debtBalanceOf);
    exchangeRates['PERI'] = numbro(exchangeRates['PERI']);
    mintingAmount = numbro(mintingAmount);

	if (!PERITotalBalance.value() || !debtBalanceOf.value() || !exchangeRates['PERI'].value()) {
		return "0";
	}
	
	const USDCtopUSD = numbro(stakingAmount['USDC']).multiply(numbro(exchangeRates['USDC']).value()).value();
	const USDCtopPERIRates = numbro(PERITotalBalance).multiply(exchangeRates['PERI'].value()).add(USDCtopUSD);
	
	const value = (debtBalanceOf.add(mintingAmount)).divide((USDCtopPERIRates));

	return isNaN(Number(value)) ? '0.00' : Math.round(Number(numbro(100).divide(value).format({mantissa: 2}))).toString();
}