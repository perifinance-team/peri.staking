import { utils } from 'ethers';
import { calculator, currencyToPynths, pynthsToCurrency } from 'lib'

export const getBurnMaxAmount = ({ balances, type, issuanceRatio, exchangeRates, staked }) => {
    let pUSD;
    
    if (balances['debt'].lte(balances['pUSD'])) {
        if(type === 'PERI') {     
            const PERIBalance = utils.formatEther(calculator(balances['PERI'], balances['rewardEscrow'], 'sub'));
		    const stakedPERI = utils.formatEther(calculator(PERIBalance, balances['transferablePERI'], 'sub'));
            const stakedUSDCTopUSD = currencyToPynths(staked['USDC'], issuanceRatio, exchangeRates['USDC']);
			const stakedPERITopUSD = currencyToPynths(stakedPERI, issuanceRatio, exchangeRates['PERI']);
			const balanceOfStakedpUSD = calculator(stakedUSDCTopUSD, stakedPERITopUSD, 'add');
			const escrowStakedpUSD = calculator(balances['debt'], balanceOfStakedpUSD, 'sub');
			const escrowStakedPERI = utils.formatEther(pynthsToCurrency(escrowStakedpUSD, issuanceRatio, exchangeRates['PERI']));

            const totalStakedPERI = calculator(stakedPERI, escrowStakedPERI, 'add');

            pUSD = currencyToPynths(totalStakedPERI, issuanceRatio, exchangeRates['PERI']).toString();
        } else if (type === 'USDC') {
            pUSD = currencyToPynths(staked['USDC'], issuanceRatio, exchangeRates['USDC']);
        } else {
            pUSD = balances['pUSD'];
        }
    } else {
        pUSD = balances['debt'];
    }

    const USDC = '0.000000';
    
    return {
        pUSD: utils.formatEther(pUSD),
        USDC,
    }
}