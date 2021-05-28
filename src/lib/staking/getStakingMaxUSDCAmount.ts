import numbro from 'numbro'

export const getStakingMaxUSDCAmount = ({mintingAmount, balances, stakedUSDC, issuanceRatio, exchangeRates}) => {
    let maxAmount = numbro(mintingAmount).divide(numbro(issuanceRatio).value()).divide(numbro(exchangeRates['USDC']).value());
    let debtForStakingAble = numbro(balances['debt']).add(mintingAmount).multiply(0.2).multiply(issuanceRatio).subtract(stakedUSDC);
    
    if(balances['USDC'] < debtForStakingAble) {
        debtForStakingAble = numbro(balances['USDC']);
    } 

    if(debtForStakingAble < maxAmount) {
        maxAmount = debtForStakingAble;
    }
    
    return maxAmount.format({mantissa: 6});
}