import { utils } from 'ethers';
import numbro from 'numbro';
import { pynthetix, USDC, getCurrencyFormat } from 'lib';
import { getBalance } from 'helpers/wallet/getBalance'

const currenciesToBytes = {
    PERI: utils.formatBytes32String('PERI'),
    pUSD: utils.formatBytes32String('pUSD'),
    USDC: utils.formatBytes32String('USDC'),
}

export type StakingData = {
    issuanceRatio: string,
    exchangeRates: {
        PERI: string,
        USDC: string,
    }, 
    issuable: {
        pUSD: string,
    },
    stakeable: {
        USDC: string
        PERI: string,
    },
    balances: {
        debt: string,
        USDC: string,
        PERITotal: string
        pUSD: string,
        transferablePERI: string,
    },
    stakedAmount: {
        USDC: string
    },
    allowance: {
        USDC: string
    }
}

export const getStakingData = async (currentWallet) => {
    const { js: { PeriFinance, Issuer, ExchangeRates } }  = pynthetix as any;

    const balances = {
        debt: utils.formatEther(await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes['pUSD'])),
        USDC: (await USDC.balanceOf(currentWallet)).toString(),
        PERITotal: utils.formatEther(await PeriFinance.collateral(currentWallet)),
        transferablePERI: utils.formatEther(await PeriFinance.transferablePeriFinance(currentWallet)),
        pUSD: utils.formatEther(await getBalance(currentWallet, 'pUSD')),
    }
    

    const stakedAmount = {
        USDC: numbro(await PeriFinance.usdcStakedAmountOf(currentWallet)).divide(10**6).value().toString(),
    }

    const issuanceRatio = utils.formatEther(await Issuer.issuanceRatio());
    
    const exchangeRates = {
        PERI: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['PERI'])),
        USDC: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['USDC'])) && "1.00",
    }
    
    let stakeableUSDC = numbro(await PeriFinance.availableUSDCStakeAmount(currentWallet)).multiply(10**6).format({mantissa: 2});
    stakeableUSDC = numbro(balances['USDC']).subtract(numbro(stakeableUSDC).value()).value() > 0 ? stakeableUSDC : numbro(balances['USDC']).format({mantissa: 2})
    const issuablepUSD = utils.formatEther((await PeriFinance.remainingIssuablePynths(currentWallet))[0].toString());
    
    const issuable = {
        pUSD: numbro(issuablepUSD).add(
            numbro(stakeableUSDC).multiply(numbro(issuanceRatio).value())
            .divide(numbro(exchangeRates['USDC']).value()).value()
        ).value().toString(),
    }
        
    const stakeable = {
        USDC: stakeableUSDC,
        PERI: balances.transferablePERI
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
}