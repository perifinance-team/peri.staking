import numbro from 'numbro'

export const getStakingMaxUSDCAmount = ({mintingAmount, balances, stakedUSDC, issuanceRatio, exchangeRates}) => {
    let maxAmount = numbro(mintingAmount).divide(numbro(issuanceRatio).value()).divide(numbro(exchangeRates['USDC']).value());
    console.log(maxAmount)
    let debtForStakingAble = numbro(balances['debt']).add(mintingAmount).multiply(0.2).multiply(issuanceRatio).subtract(stakedUSDC);
    console.log(debtForStakingAble)
    
    if(balances['USDC'] < debtForStakingAble) {
        debtForStakingAble = numbro(balances['USDC']);
    } 

    if(debtForStakingAble < maxAmount) {
        maxAmount = debtForStakingAble;
    }
    
    return maxAmount.value() < 0 ? '0' : maxAmount.format({mantissa: 6});
}