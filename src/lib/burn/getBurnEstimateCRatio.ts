import numbro from 'numbro'

export const getBurnEstimateCRatio = ({ balances, exchangeRates, burningAmount}) => {
    
	if (!numbro(balances['debt']).value() || !numbro(balances['PERITotal']).value() || !numbro(exchangeRates['PERI']).value()) {
		return "0";
	}
	
	const USDCtopUSD = numbro(burningAmount['USDC']).multiply(numbro(exchangeRates['USDC']).value()).value();
	const USDCtopPERIRates = numbro(balances['PERITotal']).multiply(numbro(exchangeRates['PERI']).value()).subtract(USDCtopUSD);
	const value = (numbro(balances['debt']).subtract(burningAmount['pUSD'])).divide((USDCtopPERIRates).value());

	return isNaN(Number(value)) || (Number(value) === 0)  ? '0.00' : Math.round(Number(numbro(100).divide(numbro(value).value()).format({mantissa: 2}))).toString();
}