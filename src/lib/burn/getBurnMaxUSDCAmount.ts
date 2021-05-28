import numbro from 'numbro'

export const getBurnMaxUSDCAmount = ({burningAmount, stakedUSDC, issuanceRatio, exchangeRates}) => {
    let burningAble = numbro(burningAmount).divide(issuanceRatio).divide(exchangeRates['USDC']);
    return numbro(stakedUSDC).value() > burningAble.value() ? burningAble.format({mantissa: 6}) : numbro(stakedUSDC).format({mantissa: 6});
}