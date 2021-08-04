import { calculator } from 'lib'

export const getStakingEstimateCRatio = ({ PERITotalBalance, debtBalanceOf, exchangeRates, mintingAmount, stakingAmount, stakedAmount}) => {
    if(mintingAmount === '' || !mintingAmount) {
		mintingAmount = '0';
	}

	if(stakedAmount === '' || !stakedAmount) {
		stakedAmount = '0';
	}
	

	const totalUSDC = calculator(stakingAmount['USDC'], stakedAmount, 'add');
	const USDCTopUSD = calculator(totalUSDC, exchangeRates['USDC'], 'mul');
	const USDCTopUSDToPERI = calculator(USDCTopUSD, exchangeRates['PERI'], 'div');

	const totalPERIaddUSDC = calculator( PERITotalBalance, USDCTopUSDToPERI, 'add');
		
	const totalDebt = calculator(debtBalanceOf, mintingAmount, 'add');
	
	const totalDebtToPERI = calculator((totalDebt).toString(), exchangeRates['PERI'], 'div');
	console.log(totalDebtToPERI.toString());
	console.log(totalPERIaddUSDC.toString());
	return calculator('100', calculator(totalDebtToPERI.toString(), totalPERIaddUSDC, 'div'), 'div').toString();
}