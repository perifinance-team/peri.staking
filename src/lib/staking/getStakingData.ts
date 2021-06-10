import { utils } from 'ethers';
import { pynthetix, USDC, calculator, currencyToPynths, RewardEscrow } from 'lib';
import { getBalance } from 'helpers/wallet/getBalance'
import { pynthsToCurrency } from 'lib/convert';



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

export const getStakingData = async (currentWallet, type) => {


    const { js: { PeriFinance, Issuer, ExchangeRates } }  = pynthetix as any;
    
        const balances = {
            debt: await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes['pUSD']),
            USDC: await USDC.balanceOf(currentWallet),
            PERITotal: await PeriFinance.collateral(currentWallet),
            transferablePERI: await PeriFinance.transferablePeriFinance(currentWallet),
            pUSD: await getBalance(currentWallet, 'pUSD'),
            rewardEscrow: await RewardEscrow.balanceOf(currentWallet)
        }
        
        const issuanceRatio = utils.parseEther(utils.parseEther('100').div(await Issuer.issuanceRatio()).toString());

        const exchangeRates = {
            PERI: await ExchangeRates.rateForCurrency(currenciesToBytes['PERI']),
            USDC: await ExchangeRates.rateForCurrency(currenciesToBytes['USDC']),
        }

        const USDCStakedAmountToUSDC = await PeriFinance.usdcStakedAmountOf(currentWallet);

        const USDCTopUSD = currencyToPynths(balances['USDC'], issuanceRatio, exchangeRates['USDC']);

        const USDCStakedAmountTopUSD = currencyToPynths(USDCStakedAmountToUSDC, issuanceRatio, exchangeRates['USDC']);

        const PERITotalStakedAmountToPERI = calculator(calculator(balances['PERITotal'], balances['rewardEscrow'], 'sub'), balances['transferablePERI'],'sub');

        const PERITotalStakedAmountTopUSD = currencyToPynths(PERITotalStakedAmountToPERI, issuanceRatio, exchangeRates['PERI']);
        
        const PERIStakedRewardEscrowTopUSD = calculator(calculator(balances['debt'], USDCStakedAmountTopUSD, 'sub'), PERITotalStakedAmountTopUSD, 'sub');
        
        const PERIStakedRewardEscrowToPERI = pynthsToCurrency(PERIStakedRewardEscrowTopUSD, issuanceRatio, exchangeRates['PERI']);

        const PERIStakeableRewardEscrowToPERI = calculator(balances['rewardEscrow'], PERIStakedRewardEscrowToPERI, 'sub');

        const PERITotalStakealbeAmountToPERI = calculator(balances['transferablePERI'], PERIStakeableRewardEscrowToPERI, 'add');
        const PERITotalStakealbeAmountTopUSD = currencyToPynths(PERITotalStakealbeAmountToPERI, issuanceRatio, exchangeRates['PERI']);

        let USDCStakeableAmountTopUSD;
        if(type === 'USDC') {
            USDCStakeableAmountTopUSD = calculator(
                calculator(
                    PERITotalStakedAmountTopUSD,
                    utils.bigNumberify('5'), 
                    'div'
                ), 
                USDCStakedAmountTopUSD, 
            'sub');
        } else if (type === 'PERIandUSDC'){
            USDCStakeableAmountTopUSD = calculator(
                calculator(
                    calculator(PERITotalStakealbeAmountTopUSD, PERITotalStakedAmountTopUSD, 'add'),
                        utils.bigNumberify('5'), 
                        'div'
                    ), 
                USDCStakedAmountTopUSD, 
            'sub');
        } else {
            USDCStakeableAmountTopUSD = utils.bigNumberify('0');
        }
        
        if(USDCTopUSD.lt(USDCStakeableAmountTopUSD)) {
            USDCStakeableAmountTopUSD = USDCTopUSD
        }

        if(PERITotalStakealbeAmountTopUSD.lt(utils.bigNumberify('0'))) {    
            const PERITotalStakealbeAmountToUSDC = currencyToPynths(PERITotalStakealbeAmountTopUSD, issuanceRatio, exchangeRates['USDC'])
            USDCStakeableAmountTopUSD = calculator(USDCStakeableAmountTopUSD, PERITotalStakealbeAmountToUSDC, 'add');
        }

        const USDCStakeableAmountToUSDC = pynthsToCurrency(USDCStakeableAmountTopUSD, issuanceRatio, exchangeRates['USDC']).div(10**12).mul(10**12);

        const USDCStakeableAmountTopUSDDecimal6 = currencyToPynths(USDCStakeableAmountToUSDC, issuanceRatio, exchangeRates['USDC']);

        const issuable = {
            pUSD: PERITotalStakealbeAmountTopUSD.lt(utils.bigNumberify('0')) ? '0' : utils.formatEther(PERITotalStakealbeAmountTopUSD),
            USDC: USDCStakeableAmountTopUSD.lt(utils.bigNumberify('0')) ? '0' : utils.formatEther(USDCStakeableAmountTopUSD),
            all: (USDCStakeableAmountTopUSD).add(PERITotalStakealbeAmountTopUSD).lt(utils.bigNumberify('0')) ? '0' : 
            utils.formatEther((USDCStakeableAmountTopUSDDecimal6).add(PERITotalStakealbeAmountTopUSD))
        }
        
        const stakeable = {
            USDC: USDCStakeableAmountTopUSD.lt(utils.bigNumberify('0')) ? '0' : utils.formatEther(USDCStakeableAmountToUSDC),
            PERI: utils.formatEther(PERITotalStakealbeAmountToPERI)
        };
        
        const allowance = {
            USDC: await USDC.allowance(currentWallet)
        };

        return {
            balances,
            issuanceRatio,
            exchangeRates,
            issuable,
            stakedAmount: {
                USDC: USDCStakedAmountToUSDC
            },
            stakeable,
            allowance
        }
        
    
        
    //     return {
    //         issuanceRatio: utils.parseEther('0'),
    //         exchangeRates: {
    //             PERI: utils.parseEther('0'),
    //             USDC: utils.parseEther('0'),
    //         }, 
    //         issuable: {
    //             pUSD: '0',
    //             USDC: '0',
    //             all: '0',
    //         },
    //         stakeable: {
    //             USDC: '0',
    //             PERI: '0',
    //         },
    //         balances: {
    //             debt: utils.parseEther('0'),
    //             USDC: utils.parseEther('0'),
    //             PERITotal: utils.parseEther('0'),
    //             pUSD: utils.parseEther('0'),
    //             transferablePERI: utils.parseEther('0'),
    //         },
    //         stakedAmount: {
    //             USDC: utils.parseEther('0')
    //         },
    //         allowance: {
    //             USDC: utils.parseEther('0')
    //         }
        
    // }
    
    
    
}