import numbro from 'numbro'
import { convertDecimal } from 'lib'
export const getBurnMaxUSDCAmount = ({burningAmount, stakedUSDC, issuanceRatio, exchangeRates, decimal}) => {
    let burningAble = numbro(burningAmount).divide(issuanceRatio).divide(exchangeRates['USDC']);
    return numbro(stakedUSDC).value() > burningAble.value() ? convertDecimal(burningAble, decimal) : convertDecimal(stakedUSDC, decimal);
}