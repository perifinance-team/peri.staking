import { pynthetix } from 'lib'
import { utils } from 'ethers'
import numbro from 'numbro'

export type BurnData = {
    PERIDebtpUSD: string,
    pUSDBalance: string,
    issuanceRatio: string,
    exchangeRates: {
        PERI: string,
        USDC: string
    },
    PERIBalance: string,
    USDCDebtpUSD: string
}

const currenciesToBytes = {
    PERI: utils.formatBytes32String('PERI'),
    pUSD: utils.formatBytes32String('pUSD'),
    USDC: utils.formatBytes32String('USDC')
}

export const getBurnData = async (currentWallet) => {
    const { js: { PeriFinance, pUSD, Issuer, ExchangeRates} } = pynthetix as any;
    const PERIDebtpUSD = utils.formatEther(await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes.pUSD));
    const pUSDBalance = utils.formatEther(await pUSD.balanceOf(currentWallet));
    const issuanceRatio = utils.formatEther(await Issuer.issuanceRatio());
    const exchangeRates = {
        PERI: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['PERI'])),
        USDC: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['USDC'])) && "0.90",
    }
    const PERIBalance = utils.formatEther(await PeriFinance.balanceOf(currentWallet));
    const USDCDebtpUSD = numbro(await PeriFinance.usdcStakedAmountOf(currentWallet)).divide(10**6).value().toString();

    return {
        PERIDebtpUSD,
        pUSDBalance,
        issuanceRatio,
        exchangeRates,
        PERIBalance,
        USDCDebtpUSD
    }
}