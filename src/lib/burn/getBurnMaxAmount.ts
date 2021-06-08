import { utils } from 'ethers';
import { calculator, currencyToPynths, pynthsToCurrency } from 'lib'

export const getBurnMaxAmount = ({ balances, type, issuanceRatio, exchangeRates, staked }) => {
    let pUSD;
    
    if (balances['debt'].lte(balances['pUSD'])) {
        if(type === 'PERI') {

            // const USDCTopUSD = currencyToPynths(balances['USDC'], issuanceRatio, exchangeRates['USDC']);
            const USDCStakedAmountToUSDC = staked['USDC'];
            
            const USDCStakedAmountTopUSD = currencyToPynths(USDCStakedAmountToUSDC, issuanceRatio, exchangeRates['USDC']);
    
            const PERITotalStakedAmountToPERI = calculator(calculator(balances['PERITotal'], balances['rewardEscrow'], 'sub'), balances['transferablePERI'],'sub');
        
            const PERITotalStakedAmountTopUSD = currencyToPynths(PERITotalStakedAmountToPERI, issuanceRatio, exchangeRates['PERI']) ;
            const PERITotalBurnableAmountTopUSD = calculator(
                PERITotalStakedAmountTopUSD,
                calculator(USDCStakedAmountTopUSD, utils.bigNumberify('4'), 'mul'),
                'sub'
            )
            pUSD = PERITotalBurnableAmountTopUSD;
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