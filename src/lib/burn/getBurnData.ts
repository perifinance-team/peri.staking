import { pynthetix } from 'lib'
import { utils } from 'ethers'

export type BurnData = {
    issuanceRatio: utils.BigNumber,
    balances: {
        debt: utils.BigNumber,
        PERI: utils.BigNumber,
        pUSD: utils.BigNumber,
    }
    exchangeRates: {
        PERI: utils.BigNumber,
        USDC: utils.BigNumber
    },
    staked: {
        USDC: utils.BigNumber
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
        debt: await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes.pUSD),
        PERI: await PeriFinance.balanceOf(currentWallet),
        PERITotal: await PeriFinance.collateral(currentWallet),
        transferablePERI: await PeriFinance.transferablePeriFinance(currentWallet),
        pUSD: value[pUSDIndex],
    }

    const staked = {
        USDC: (await PeriFinance.usdcStakedAmountOf(currentWallet)),
    }

    const issuanceRatio = utils.parseEther(utils.parseEther('100').div(await Issuer.issuanceRatio()).toString());
    const exchangeRates = {
        PERI: await ExchangeRates.rateForCurrency(currenciesToBytes['PERI']),
        USDC: await ExchangeRates.rateForCurrency(currenciesToBytes['USDC']),
    }

    return {
        issuanceRatio,
        exchangeRates,
        balances,
        staked,
    }
}