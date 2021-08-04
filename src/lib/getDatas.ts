import pynthetix from './pynthetix'
import { utils } from 'ethers'
import numbro from 'numbro'
import { USDCContract } from 'lib'

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


export const getRatio = async (currentWallet) => {
    const {
		js: { 
            SystemSettings,
            PeriFinance,
            Liquidations,
        },
	} = pynthetix as any;
    
    const getCurrentCRatio = async () => {
        
        return (await PeriFinance.collateralisationRatio(currentWallet)).div(10**12).mul(10**12).toString()
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

export const getVestable = async (currentWallet) => {
    const {
		js: { 
            PeriFinanceEscrow
        },
	} = pynthetix as any;
    return (await PeriFinanceEscrow.getNextVestingIndex(currentWallet)).toNumber() > 0;
}

export const getBalances = async (currentWallet) => {
    const {
		js: { 
            PynthUtil,
            PeriFinance,
            ExchangeRates
        },
        provider
	} = pynthetix as any;

    const periRate = utils.formatEther(await ExchangeRates.rateForCurrency(utils.formatBytes32String('PERI')));
    const USDCRate = utils.formatEther(await ExchangeRates.rateForCurrency(utils.formatBytes32String('USDC')));
    const debtBalance = utils.formatEther(await PeriFinance.debtBalanceOf(currentWallet, utils.formatBytes32String('pUSD')));
    const transferablePERI = utils.formatEther(await PeriFinance.transferablePeriFinance(currentWallet));
    const periBalance = utils.formatEther(await PeriFinance.collateral(currentWallet));
    const stakedUSDCamount = utils.formatEther(await PeriFinance.usdcStakedAmountOf(currentWallet));
    // const rewardEscrow = utils.formatEther(await RewardEscrow.balanceOf(currentWallet));
    const [keys, value] = await PynthUtil.pynthsBalances(currentWallet);
    const USDCBalance = await USDCContract.balanceOf(currentWallet);
    const ethBalance = utils.formatEther(await provider.getBalance(currentWallet));

    const getTransferables = async () => {        
        let tranferables = {};

        tranferables['PERI'] = {   
            balance: (transferablePERI),
            balanceToUSD: numbro(periRate).multiply(numbro(transferablePERI).value()).value().toString()
        }
        
        keys.forEach((key, index) => {
            tranferables[utils.parseBytes32String(key)] = {
                balance: (utils.formatEther(value[index])),
                balanceToUSD: (utils.formatEther(value[index]))
            }
        });
        
        tranferables['USDC'] = {
            balance: utils.formatEther(USDCBalance),
            balanceToUSD: numbro(USDCRate).multiply(numbro(utils.formatEther(USDCBalance)).value()).value().toString()
        }

        tranferables['ETH'] = {
            balance: (ethBalance),
            balanceToUSD: numbro(3000).multiply(numbro(ethBalance).value()).value().toString()
        }
        return tranferables;
    }

    const getBalances = async () => {
        let balances = {};

        balances['debt'] = {
            balance: (debtBalance),
            balanceToUSD: debtBalance
        }

        balances['PERI'] = {   
            balance: (periBalance),
            balanceToUSD: numbro(periRate).multiply(numbro(periBalance).value()).value().toString()
        }
        
        keys.forEach((key, index) => {
            balances[utils.parseBytes32String(key)] = {
                balance: (utils.formatEther(value[index])),
                balanceToUSD: (utils.formatEther(value[index]))
            }
        });
        const totalUSDC = numbro(utils.formatEther(USDCBalance)).add(numbro(stakedUSDCamount).value());
        balances['USDC'] = {
            balance: totalUSDC.value(),
            balanceToUSD: numbro(USDCRate).multiply(numbro(totalUSDC).value()).value().toString()
        }

        balances['ETH'] = {
            balance: (ethBalance),
            balanceToUSD: numbro(3000).multiply(numbro(ethBalance).value()).value().toString()
        }

        return balances;
    }
    
    return {
        transferables: await getTransferables(),
        balances: await getBalances()
    };
}