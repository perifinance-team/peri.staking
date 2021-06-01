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
    const { js: { PeriFinance, Issuer, ExchangeRates, PynthUtil } } = pynthetix as any;
    const [keys, value] = await PynthUtil.pynthsBalances(currentWallet);
    const pUSDIndex = keys.findIndex( (key) => utils.parseBytes32String(key) === 'pUSD');

    const balances = {
        debt: utils.formatEther(await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes.pUSD)).toString(),
        PERI: utils.formatEther(await PeriFinance.balanceOf(currentWallet)).toString(),
        PERITotal: utils.formatEther(await PeriFinance.collateral(currentWallet)),
        transferablePERI: utils.formatEther(await PeriFinance.transferablePeriFinance(currentWallet)),
        pUSD: utils.formatEther(value[pUSDIndex]),
    }

    const staked = {
        USDC: numbro(await PeriFinance.usdcStakedAmountOf(currentWallet)).divide(10**18).value().toString(),
    }

    const issuanceRatio = utils.formatEther(await Issuer.issuanceRatio());
    const exchangeRates = {
        PERI: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['PERI'])),
        USDC: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['USDC'])),
    }

    return {
        issuanceRatio,
        exchangeRates,
        balances,
        staked,
    }
}