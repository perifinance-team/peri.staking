import { calculator } from 'lib'

export const getBurnEstimateCRatio = ({ balances, exchangeRates, burningAmount, stakedAmount}) => {
    
	const totalUSDC = calculator(stakedAmount, burningAmount['USDC'], 'sub');

	const USDCTopUSD = calculator(totalUSDC, exchangeRates['USDC'], 'mul');

	const USDCTopUSDToPERI = calculator(USDCTopUSD, exchangeRates['PERI'], 'div');

	const totalPERIaddUSDC = calculator( balances['debt'], USDCTopUSDToPERI, 'add');
	
	const totalDebt = calculator(balances['debt'], burningAmount['pUSD'], 'sub');
	
	const totalDebtToPERI = calculator((totalDebt).toString(), exchangeRates['PERI'], 'div');
	return calculator('100', calculator(totalDebtToPERI.toString(), totalPERIaddUSDC, 'div'), 'div').toString();
}