import numbro from 'numbro'

export const getStakingAmount = ({ issuanceRatio, exchangeRates, mintingAmount, maxMintingAmount, stakingAmount, maxStakingAmount }) => {
    const maxAmountCheckToBalance = (amount, currency) => {
        let value;
        if(currency === 'pUSD') {
            value = Number(numbro(maxMintingAmount['pUSD']).subtract(numbro(amount).value())) < 0 ;
        } else if (currency === 'USDC') {
            value = Number(numbro(maxStakingAmount['USDC']).subtract(numbro(amount).value())) < 0 ;
        } else if (currency === 'PERI') {
            value = Number(numbro(maxStakingAmount['PERI']).subtract(numbro(amount).value())) < 0 ;
        }
        return isNaN(value) ? true : value;
    }

    issuanceRatio = numbro(issuanceRatio);
    
    exchangeRates = {
        PERI: numbro(exchangeRates['PERI']),
        USDC: numbro(exchangeRates['USDC'])
    }
    
    if (!issuanceRatio.value() || !exchangeRates['PERI'].value()) return {
        USDC: '0.00',
        PERI: '0.00'
    };

    // console.log(maxAmountCheckToBalance(stakingAmount['USDC'], 'USDC'));
    // if(maxAmountCheckToBalance(stakingAmount['USDC'], 'USDC')) {
    //     stakingAmount['USDC'] = maxStakingAmount['USDC'];
    // }

    const USDCtopUSD = numbro(stakingAmount['USDC']).multiply(numbro(issuanceRatio).value()).multiply(numbro(exchangeRates['USDC']).value()).value();
    const pUSDsubUSDC = numbro(mintingAmount).subtract(USDCtopUSD);
    const pUSDsubUSDCtoPERI = pUSDsubUSDC.divide(issuanceRatio).divide(exchangeRates['PERI']);

    
    return {
        PERI: pUSDsubUSDCtoPERI.format({mantissa: 6}),
        USDC: stakingAmount['USDC']
    };
    // const PERIForMintAmount = numbro(mintingAmount).subtract(numbro(stakingAmount['USDC'] | 0).multiply(issuanceRatio).multiply(exchangeRates['USDC']).value())
    // const needStakingPERIAmount = numbro(PERIForMintAmount).divide(issuanceRatio).divide(exchangeRates['PERI']);
    // if(maxAmountCheckToBalance(needStakingPERIAmount, 'PERI')) {
    //     return {
    //         USDC: stakingAmount['USDC'],
    //         PERI: (needStakingPERIAmount).format({mantissa: 6})
    //     }
    // } else {  
    //     return {
    //         USDC: stakingAmount['USDC'],
    //         PERI: (maxStakingAmount['PERI'])
    //     }
    // }
    
}