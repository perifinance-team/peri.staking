import numbro from 'numbro'

export const getStakingAmount = ({ issuanceRatio, exchangeRates, mintingAmount, stakingAmount }) => {
    issuanceRatio = numbro(issuanceRatio);
   
    exchangeRates = {
        PERI: numbro(exchangeRates['PERI']),
        USDC: numbro(exchangeRates['USDC'])
    }
    
    if (!issuanceRatio.value() || !exchangeRates['PERI'].value()) return {
        USDC: '0.00',
        PERI: '0.00'
    };

    const USDCtopUSD = numbro(stakingAmount['USDC']).multiply(numbro(issuanceRatio).value()).multiply(numbro(exchangeRates['USDC']).value()).value();
    const pUSDsubUSDC = numbro(mintingAmount).subtract(USDCtopUSD);
    const pUSDsubUSDCtoPERI = pUSDsubUSDC.divide(issuanceRatio).divide(exchangeRates['PERI']);

    
    return {
        PERI: pUSDsubUSDCtoPERI.format({mantissa: 6}),
        USDC: stakingAmount['USDC']
    };
}