import numbro from 'numbro'
import { getCurrencyFormat } from 'lib'

export const getStakingAmount = ({ issuanceRatio, exchangeRates, mintingAmount, stakingUSDCAmount }) => {
    issuanceRatio = numbro(issuanceRatio);
    mintingAmount = numbro(mintingAmount);
    exchangeRates = {
        PERI: numbro(exchangeRates['PERI']),
        USDC: numbro(exchangeRates['USDC'])
    }
    stakingUSDCAmount = numbro(stakingUSDCAmount);

    let PERIAmount;
    let stakingUSDCAmountTopUSDAmount;
    
    if (!mintingAmount.value() || !issuanceRatio.value() || !exchangeRates['PERI'].value()) return "0";
    
    if(stakingUSDCAmount.value() > 0) {
        stakingUSDCAmountTopUSDAmount = stakingUSDCAmount.multiply(issuanceRatio).multiply(exchangeRates['USDC']);
        mintingAmount.subtract(stakingUSDCAmountTopUSDAmount);
    }
    
    PERIAmount = mintingAmount.divide(issuanceRatio).divide(exchangeRates['PERI']);
    return PERIAmount.value() > 0 ? getCurrencyFormat(PERIAmount).toString() : '0.00';
}