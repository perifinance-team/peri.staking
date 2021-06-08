import { utils } from 'ethers'
import { pynthsToCurrency, calculator } from 'lib'

export const getStakingMaxUSDCAmount = ({mintingAmount, issuanceRatio, exchangeRates, stakeableUSDC, balances}) => {
    const mintAmountToMaxUSDC = pynthsToCurrency(mintingAmount, issuanceRatio, exchangeRates['USDC']);
    return (utils.parseEther(stakeableUSDC)).lt(mintAmountToMaxUSDC) ? stakeableUSDC : utils.formatEther(mintAmountToMaxUSDC);
}