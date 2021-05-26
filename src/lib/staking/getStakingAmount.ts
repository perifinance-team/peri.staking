import numbro from 'numbro'
import { getCurrencyFormat } from 'lib'

export const getStakingAmount = ({ issuanceRatio, exchangeRates, mintingAmount, maxMintingAmount, stakingAmount, maxStakingAmount, type }) => {
    
    const maxAmountCheckToBalance = (amount, currency) => {
        amount = amount.value().toString();
        
        if((/\./g).test(amount)) {
            amount = amount.match(/\d+\.\d{0,2}/g)[0];
        }
        
        if(currency === 'pUSD') {
            return Number(numbro(maxMintingAmount['pUSD'].match(/\d+\.\d{0,2}/g)[0]).subtract(numbro(amount).value()).format({mantissa: 2})) > 0;
        } else if (currency === 'USDC') {
            return Number(numbro(maxStakingAmount['USDC'].match(/\d+\.\d{0,2}/g)[0]).subtract(numbro(amount).value()).format({mantissa: 2})) > 0;
        } else if (currency === 'PERI') {
            return Number(numbro(maxStakingAmount['PERI'].match(/\d+\.\d{0,2}/g)[0]).subtract(numbro(amount).value()).format({mantissa: 2})) > 0;
        }
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
    
    if(type === 'pUSD') {
        if(maxAmountCheckToBalance(numbro(mintingAmount), 'pUSD')) {
            const PERIForMintAmount = numbro(mintingAmount).subtract(numbro(stakingAmount['USDC']).multiply(issuanceRatio).divide(exchangeRates['USDC']).value())
            const needStakingPERIAmount = numbro(PERIForMintAmount).divide(issuanceRatio).divide(exchangeRates['PERI']);
            if(maxAmountCheckToBalance(needStakingPERIAmount, 'PERI')) {
                return {
                    USDC: numbro(stakingAmount['USDC']).value().toString(),
                    PERI: getCurrencyFormat(needStakingPERIAmount)
                }
            } else {
                const PERItopUSD = needStakingPERIAmount.subtract(maxStakingAmount['PERI']).multiply(issuanceRatio).multiply(exchangeRates['PERI']);
                const needStakingUSDCAmount = PERItopUSD.divide(issuanceRatio).divide(exchangeRates['USDC']);
                return {
                    USDC: getCurrencyFormat(needStakingUSDCAmount),
                    // needStakingUSDCAmount.value().toString(),
                    PERI: getCurrencyFormat(maxStakingAmount['PERI'])
                }
            }
        } else {
            return {
                USDC: getCurrencyFormat(maxStakingAmount['USDC']),
                PERI: getCurrencyFormat(maxStakingAmount['PERI'])
            };
        }
    } else {
        if(!numbro(stakingAmount['USDC']).value() || numbro(stakingAmount['USDC']).value() === 0) {
            return {
                USDC: stakingAmount['USDC'],
                PERI: '0.00'
            };
        }

        if(maxAmountCheckToBalance(numbro(stakingAmount['USDC']), 'USDC')) {
            const PERIForMintAmount = numbro(mintingAmount).subtract(numbro(stakingAmount['USDC']).multiply(issuanceRatio).divide(exchangeRates['USDC']).value())
            const needStakingPERIAmount = numbro(PERIForMintAmount).divide(issuanceRatio).divide(exchangeRates['PERI']);
            
            return {
                USDC: stakingAmount['USDC'],
                PERI: getCurrencyFormat(needStakingPERIAmount.value().toString())
            };
            
            
        } else {
            return {
                USDC: getCurrencyFormat(maxStakingAmount['USDC']),
                PERI: getCurrencyFormat(stakingAmount['PERI'])
            };
            
        }
    }
    
}