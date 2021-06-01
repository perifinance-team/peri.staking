import { currencyToPynths, pynthsToCurrency, calculator } from 'lib'

import { utils } from 'ethers'

export const getStakingEstimateCRatio = ({ PERITotalBalance, debtBalanceOf, exchangeRates, mintingAmount, stakingAmount, stakedAmount}) => {
	
	
	const totalUSDC = calculator(stakingAmount['USDC'], stakedAmount, 'add');
	const USDCTopUSD = calculator(totalUSDC, exchangeRates['USDC'], 'mul');
	const USDCTopUSDToPERI = calculator(USDCTopUSD, exchangeRates['PERI'], 'div');

	const totalPERIaddUSDC = calculator( PERITotalBalance, USDCTopUSDToPERI, 'add');
		
	const totalDebt = calculator(debtBalanceOf, mintingAmount, 'add');
	
	const totalDebtToPERI = calculator((totalDebt).toString(), exchangeRates['PERI'], 'div');
	
	return calculator('100', calculator(totalDebtToPERI.toString(), totalPERIaddUSDC, 'div'), 'div').toString();
}