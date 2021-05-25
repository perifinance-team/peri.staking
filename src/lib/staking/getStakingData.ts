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
    },
    balances: {
        debt: string,
        USDC: string,
        PERITotal: string
        pUSD: string,
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
        USDC: utils.formatEther(await getBalance(currentWallet, 'pUSD')),
        PERITotal: utils.formatEther(await PeriFinance.collateral(currentWallet)),
        pUSD: (await USDC.balanceOf(currentWallet)).toString()
    }
    const stakedAmount = {
        USDC: numbro(await PeriFinance.usdcStakedAmountOf(currentWallet)).divide(10**6).value().toString(),
    }
    
    const issuanceRatio = utils.formatEther(await Issuer.issuanceRatio());
    const exchangeRates = {
        PERI: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['PERI'])),
        USDC: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['USDC'])) && "1.00",
    }
    
    const issuable = {
        pUSD: utils.formatEther((await PeriFinance.remainingIssuablePynths(currentWallet))[0].toString()),
    }
    
    const stakeable = {
        USDC: numbro(balances.debt).multiply(0.2).divide(numbro(issuanceRatio).value())
            .divide(numbro(exchangeRates['USDC']).value()).value().toString()
    }

    const allowance = {
        USDC: await USDC.allowance(currentWallet)
    };
    
    return {
        balances,
        issuanceRatio,
        exchangeRates,
        issuable,
        stakeable,
        stakedAmount,
        allowance
    }
}