import { pynthetix } from 'lib'
import { utils } from 'ethers'
import numbro from 'numbro'

export type BurnData = {
    issuanceRatio: string,
    balances: {
        debt: string,
        PERI: string,
        pUSD: string,
    }
    exchangeRates: {
        PERI: string,
        USDC: string
    },
    staked: {
        USDC: string
    }
}

const currenciesToBytes = {
    PERI: utils.formatBytes32String('PERI'),
    pUSD: utils.formatBytes32String('pUSD'),
    USDC: utils.formatBytes32String('USDC')
}

export const getBurnData = async (currentWallet) => {
    const { js: { PeriFinance, pUSD, Issuer, ExchangeRates} } = pynthetix as any;
    
    const balances = {
        debt: utils.formatEther(await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes.pUSD)),
        PERI: utils.formatEther(await PeriFinance.balanceOf(currentWallet)),
        pUSD: utils.formatEther(await pUSD.balanceOf(currentWallet)),
    }

    const staked = {
        USDC: numbro(await PeriFinance.usdcStakedAmountOf(currentWallet)).divide(10**6).value().toString(),
    }

    const issuanceRatio = utils.formatEther(await Issuer.issuanceRatio());
    const exchangeRates = {
        PERI: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['PERI'])),
        USDC: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['USDC'])) && "1.00",
    }

    return {
        issuanceRatio,
        exchangeRates,
        balances,
        staked,
    }
}