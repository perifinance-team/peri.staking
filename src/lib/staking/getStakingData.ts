import { utils } from 'ethers';
import { pynthetix, USDC, calculator, currencyToPynths } from 'lib';
import { getBalance } from 'helpers/wallet/getBalance'

const currenciesToBytes = {
    PERI: utils.formatBytes32String('PERI'),
    pUSD: utils.formatBytes32String('pUSD'),
    USDC: utils.formatBytes32String('USDC'),
}

export type StakingData = {
    issuanceRatio: utils.BigNumber,
    exchangeRates: {
        PERI: utils.BigNumber,
        USDC: utils.BigNumber,
    }, 
    issuable: {
        pUSD: string,
        USDC: string,
        all: string,
    },
    stakeable: {
        USDC: string,
        PERI: string,
    },
    balances: {
        debt: utils.BigNumber,
        USDC: utils.BigNumber,
        PERITotal: utils.BigNumber
        pUSD: utils.BigNumber,
        transferablePERI: utils.BigNumber,
    },
    stakedAmount: {
        USDC: utils.BigNumber
    },
    allowance: {
        USDC: utils.BigNumber
    }
}

export const getStakingData = async (currentWallet) => {
    const { js: { PeriFinance, Issuer, ExchangeRates } }  = pynthetix as any;
    try {
        
        const balances = {
            debt: await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes['pUSD']),
            USDC: await USDC.balanceOf(currentWallet),
            PERITotal: await PeriFinance.collateral(currentWallet),
            transferablePERI: await PeriFinance.transferablePeriFinance(currentWallet),
            pUSD: await getBalance(currentWallet, 'pUSD'),
        }        
        
        const stakedAmount = {
            USDC: (await PeriFinance.usdcStakedAmountOf(currentWallet)),
        }
        
        const issuanceRatio = utils.parseEther(utils.parseEther('100').div(await Issuer.issuanceRatio()).toString());
        
        const exchangeRates = {
            PERI: await ExchangeRates.rateForCurrency(currenciesToBytes['PERI']),
            USDC: await ExchangeRates.rateForCurrency(currenciesToBytes['USDC']),
        }
        
        const issuablepUSD = (await PeriFinance.remainingIssuablePynths(currentWallet))[0];
        
        let stakeableUSDC = (await PeriFinance.availableUSDCStakeAmount(currentWallet));
        
        if((stakeableUSDC).gt(balances['USDC'])) {
            stakeableUSDC = balances['USDC']
        }

        const issuable = {
            pUSD: utils.formatEther(calculator(issuablepUSD, stakedAmount['USDC'], 'sub')).toString(),
            //  .sub().mul(issuanceRatio).mul(exchangeRates['USDC']),
            // (issuablepUSD - stakedAmount['USDC'] ) issuanceRatio * exchangeRates['USDC']
            USDC: utils.formatEther(currencyToPynths(stakeableUSDC, issuanceRatio, exchangeRates['USDC'])).toString(),
            all: utils.formatEther((issuablepUSD).add((currencyToPynths(stakeableUSDC, issuanceRatio, exchangeRates['USDC'])).toString())).toString()
        }
    
        const stakeable = {
            USDC: utils.formatEther(stakeableUSDC),
            PERI: utils.formatEther(balances.transferablePERI)
        };
    
        const allowance = {
            USDC: await USDC.allowance(currentWallet)
        };

        return {
            balances,
            issuanceRatio,
            exchangeRates,
            issuable,
            stakedAmount,
            stakeable,
            allowance
        }
        
    } catch(e) {
        console.log(e);
        return {
            issuanceRatio: utils.parseEther('0'),
            exchangeRates: {
                PERI: utils.parseEther('0'),
                USDC: utils.parseEther('0'),
            }, 
            issuable: {
                pUSD: '0',
                USDC: '0',
                all: '0',
            },
            stakeable: {
                USDC: '0',
                PERI: '0',
            },
            balances: {
                debt: utils.parseEther('0'),
                USDC: utils.parseEther('0'),
                PERITotal: utils.parseEther('0'),
                pUSD: utils.parseEther('0'),
                transferablePERI: utils.parseEther('0'),
            },
            stakedAmount: {
                USDC: utils.parseEther('0')
            },
            allowance: {
                USDC: utils.parseEther('0')
            }
        }
    }
    
    
    
}