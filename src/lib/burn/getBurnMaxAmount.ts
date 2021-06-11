import { utils } from 'ethers';
import { calculator, currencyToPynths } from 'lib'

export const getBurnMaxAmount = ({ balances, type, issuanceRatio, exchangeRates, staked }) => {
    let pUSD;
    if(type === 'PERI') {
        // const USDCTopUSD = currencyToPynths(balances['USDC'], issuanceRatio, exchangeRates['USDC']);
        const USDCStakedAmountToUSDC = staked['USDC'];
        
        const USDCStakedAmountTopUSD = currencyToPynths(USDCStakedAmountToUSDC, issuanceRatio, exchangeRates['USDC']);
        
        const PERITotalBurnableAmountTopUSD = calculator(
            balances['debt'],
            calculator(USDCStakedAmountTopUSD, utils.bigNumberify('4'), 'mul'),
            'sub'
        )
        pUSD = PERITotalBurnableAmountTopUSD;
    } else if (type === 'USDC') {
        pUSD = currencyToPynths(staked['USDC'], issuanceRatio, exchangeRates['USDC']);
    } else {
        pUSD = balances['pUSD'];
    }

    if (balances['debt'].lte(pUSD)) {
        pUSD = balances['debt'];
    }

    if (balances['pUSD'].lte(pUSD)) {
        pUSD = balances['pUSD'];
    }

    const USDC = '0.000000';
    
    return {
        pUSD: utils.formatEther(pUSD),
        USDC,
    }
}