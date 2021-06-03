import { calculator } from 'lib'

export const getBurnEstimateCRatio = ({ balances, exchangeRates, burningAmount, stakedAmount}) => {
    if(burningAmount === '' || !burningAmount) {
		burningAmount = '0';
	}
	
	const USDCTopUSD = calculator(burningAmount['USDC'], exchangeRates['USDC'], 'mul');
	
	const USDCTopUSDToPERI = calculator(USDCTopUSD, exchangeRates['PERI'], 'div');
	
	const totalPERIaddUSDC = calculator( balances['PERITotal'], USDCTopUSDToPERI, 'sub');
	
	const totalDebt = calculator(balances['debt'], burningAmount['pUSD'], 'sub');
	
	const totalDebtToPERI = calculator((totalDebt).toString(), exchangeRates['PERI'], 'div');

	return calculator('100', calculator(totalDebtToPERI.toString(), totalPERIaddUSDC, 'div'), 'div').toString();
}