import pynthetix from './pynthetix'
import { utils } from 'ethers'
import numbro from 'numbro'
import { USDC, RewardEscrow, calculator } from 'lib'

const format = (value) => {
    if(!value) return '0.00';
    return (numbro(value).divide(1e18)).value().toString();
}

export const getExchangeRates = async () => {
    const {
		js: { ExchangeRates, PynthUtil },
	} = pynthetix as any;

    const currencyPeri = 'PERI';
    let value = {
        USDC: '0.00',
        PERI: '0.00',
        ETH: '0.00',
        iBTC: '0.00',
        iETH: '0.00',
        pBTC: '0.00',
        pETH: '0.00',
    };
    const getPeriExchangeRate = async () => {
        value[currencyPeri] = format(await ExchangeRates.rateForCurrency(utils.formatBytes32String(currencyPeri)))
        value['USDC'] = format(await ExchangeRates.rateForCurrency(utils.formatBytes32String('USDC')));
    }

    const getPynthsRates = async () => {
        const [keys, rates] = await PynthUtil.pynthsRates();

        return keys.forEach((key, index) => {
            const coinName = utils.parseBytes32String(key);
            value[coinName] = format(rates[index]);
        });
    }
    await getPeriExchangeRate();
    await getPynthsRates();

    return value;
}


export const getRatio = async (walletAddress) => {
    const {
		js: { 
            SystemSettings,
            PeriFinance,
            Liquidations,
        },
	} = pynthetix as any;
    
    const getCurrentCRatio = async () => {
        return (await PeriFinance.collateralisationRatio(walletAddress)).toString();
    };

    const getTargetCRatio = async () => {
        return (await SystemSettings.issuanceRatio()).toString();
    };
    
    const getLiquidationRatio = async () => {
        return (await Liquidations.liquidationRatio()).toString();
    };
    const currentCRatio = await getCurrentCRatio();

    const targetCRatio = await getTargetCRatio();
    const liquidationRatio = await getLiquidationRatio();
    
    return {
        currentCRatio,
        targetCRatio,
        liquidationRatio
    }
}

export const getBalancess = async (walletAddress) => {
    const {
		js: { 
            PynthUtil,
            PeriFinance,
            ExchangeRates
        },
        provider
	} = pynthetix as any;

    
    const getPynthsBalances = async () => {
        let balances = [];
        
        
        const periRate = utils.formatEther(await ExchangeRates.rateForCurrency(utils.formatBytes32String('PERI')));
        const USDCRate = utils.formatEther(await ExchangeRates.rateForCurrency(utils.formatBytes32String('USDC')));
        
        const periBalance = utils.formatEther(await PeriFinance.collateral(walletAddress));
        const PERIBalanceInfo = {
            coinName: 'PERI',
            balance: (periBalance),
            balanceToUSD: numbro(periRate).multiply(numbro(periBalance).value()).value().toString()
        }
        
        balances.push(PERIBalanceInfo);
        
        const [keys, value] = await PynthUtil.pynthsBalances(walletAddress);
        
        keys.forEach((key, index) => {
            balances.push({
                coinName: utils.parseBytes32String(key),
                balance: (utils.formatEther(value[index])),
                balanceToUSD: (utils.formatEther(value[index]))
            })
        });
        
        const USDCBalance = utils.formatEther(await USDC.balanceOf(walletAddress));
        
        balances.push({
            coinName: 'USDC',
            balance: USDCBalance.toString(),
            balanceToUSD: numbro(USDCRate).multiply(numbro(USDCBalance).value()).value().toString()
        });

        const ethBalance = utils.formatEther(await provider.getBalance(walletAddress));
        balances.push({
            coinName: 'ETH',
            balance: (ethBalance),
            balanceToUSD: numbro(3000).multiply(numbro(ethBalance).value()).value().toString()
        });
        
        return { balances, PERIBalanceInfo, USDCBalanceInfo: {
            coinName: 'USDC',
            balance: USDCBalance.toString(),
        }};
    }
    const debtBalance = utils.formatEther(await PeriFinance.debtBalanceOf(walletAddress, utils.formatBytes32String('pUSD')));
    const transferablePERI = utils.formatEther(await PeriFinance.transferablePeriFinance(walletAddress));
    const stakedUSDCamount = numbro(await PeriFinance.usdcStakedAmountOf(walletAddress)).divide(10**18).value().toString()
    const {balances, PERIBalanceInfo, USDCBalanceInfo} = await getPynthsBalances();
    
    const rewardEscrow = utils.formatEther(await RewardEscrow.balanceOf(walletAddress));
    
    return {
        balances,
        debtBalance,
        PERIBalanceInfo,
        USDCBalanceInfo,
        transferablePERI,
        stakedUSDCamount,
        rewardEscrow
    };
}