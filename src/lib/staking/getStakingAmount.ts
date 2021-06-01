import { currencyToPynths, pynthsToCurrency, calculator } from 'lib'
import { utils } from 'ethers'

export const getStakingAmount = ({ issuanceRatio, exchangeRates, mintingAmount, stakingAmount }) => {
    
    const USDCtopUSD = currencyToPynths(stakingAmount['USDC'], issuanceRatio, exchangeRates['USDC']);
    const pUSDsubUSDC = calculator(mintingAmount, USDCtopUSD, 'sub');
    const pUSDsubUSDCtoPERI = pynthsToCurrency(pUSDsubUSDC, issuanceRatio, exchangeRates['PERI'])
    
    return {
        PERI: utils.formatEther(pUSDsubUSDCtoPERI).toString(),
        USDC: stakingAmount['USDC'].toString()
    };
}