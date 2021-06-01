
import { pynthsToCurrency } from 'lib'
import { utils } from 'ethers';
export const getBurnMaxUSDCAmount = ({burningAmount, stakedUSDC, issuanceRatio, exchangeRates}) => {
    let burningAble = pynthsToCurrency(burningAmount, issuanceRatio, exchangeRates['USDC']);

    return stakedUSDC.lte(burningAble) ? utils.formatEther(stakedUSDC) : utils.formatEther(burningAble);
}