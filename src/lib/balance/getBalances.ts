import { contracts } from 'lib/contract'
import { utils } from 'ethers'
import { getBalance } from './getBalance'
import { formatDecimal } from 'lib'
export const getBalances = async (currentWallet, currencies, exchangeRates, targetCRatio, currentCRatio) => {
    const stakeAble: boolean = currentCRatio === 0n || currentCRatio <= 25n * BigInt(Math.pow(10, 16).toString()); //0.25;

    const {
        PeriFinance,
        ExternalTokenStakeManager,
        RewardEscrowV2,
    } = contracts as any;
    
    const USDCDecimal = contracts.networkId === 56 ? 18 : currencies['USDC'].decimal;
    const DAIDecimal = currencies['DAI'].decimal;
    
    const debtBalance = BigInt((await PeriFinance.debtBalanceOf(currentWallet, utils.formatBytes32String('pUSD'))).toString());
    
    const periBalance = BigInt((await PeriFinance.collateral(currentWallet)).toString());
    const transferablePERI = 0n;
    
    const PERIRewardEscrow = BigInt((await RewardEscrowV2.balanceOf(currentWallet)).toString());
    const LPRewardEscrow = contracts['LP'] ? BigInt((await contracts['LP'].earned(currentWallet)).toString()) : 0n;
    
    const stakedUSDC = BigInt((await ExternalTokenStakeManager.stakedAmountOf(currentWallet, utils.formatBytes32String('USDC'), utils.formatBytes32String('USDC'))).toString());
    const stakedDAI = BigInt((await ExternalTokenStakeManager.stakedAmountOf(currentWallet, utils.formatBytes32String('DAI'), utils.formatBytes32String('DAI'))).toString());

    const stakedLP = contracts['LP'] ?  BigInt((await contracts['LP'].stakedAmountOf(currentWallet)).toString()) : 0n;
    
    const pUSDBalance = await getBalance(currentWallet, 'PynthpUSD', currencies['pUSD'].decimal);
    const USDCBalance = await getBalance(currentWallet, 'USDC', USDCDecimal);
    const DAIBalance = await getBalance(currentWallet, 'DAI', DAIDecimal);
    const LPBalance = contracts['LP'] ? await getBalance(currentWallet, 'LP', currencies['LP'].decimal): 0n;
    
    const USDCDEBT = (stakedUSDC * exchangeRates['USDC'] / BigInt(Math.pow(10, 18).toString()) / (BigInt(Math.pow(10, 18).toString()) / targetCRatio));
    const DAIDEBT = (stakedDAI * exchangeRates['DAI'] / BigInt(Math.pow(10, 18).toString()) / (BigInt(Math.pow(10, 18).toString()) / targetCRatio));
    const stableDEBT = USDCDEBT + DAIDEBT;
    const PERIDEBT = debtBalance - stableDEBT;
    
    
    let mintableStable = ((PERIDEBT / 4n) - (stableDEBT));
    mintableStable = mintableStable <= 0n ? 0n : mintableStable;

    let USDCStakable = stakeAble ? mintableStable * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) * BigInt(Math.pow(10, 18).toString()) / exchangeRates['USDC'] : 0n
    let DAIStakable = stakeAble ? mintableStable * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) * BigInt(Math.pow(10, 18).toString()) / exchangeRates['DAI'] : 0n

    if(USDCStakable > USDCBalance) {
        USDCStakable = USDCBalance;
    }

    if(DAIStakable > DAIBalance) {
        DAIStakable = DAIBalance;
    }

    let PERIStaked = PERIDEBT * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) * BigInt(Math.pow(10, 18).toString()) / exchangeRates['PERI'];
    PERIStaked = periBalance < PERIStaked ? periBalance : PERIStaked;
    let PERIStakable = periBalance - PERIStaked;
    PERIStakable = PERIStakable <= 0n ? 0n : PERIStakable;

    const USDCAllowance = formatDecimal(BigInt((await contracts['USDC'].allowance(currentWallet, contracts?.addressList['ExternalTokenStakeManager'].address)).toString()), USDCDecimal);
    const DAIAllowance = formatDecimal(BigInt((await contracts['DAI'].allowance(currentWallet, contracts?.addressList['ExternalTokenStakeManager'].address)).toString()), DAIDecimal);
    const LPAllowance = contracts['LP'] ? BigInt((await contracts['LP'].allowance(currentWallet)).toString()) : 0n
    
    return {
        DEBT: {
            ...currencies['DEBT'],
            balance: debtBalance,
            transferable: 0n,
            USDC: USDCDEBT,
            DAI: DAIDEBT,
            PERI: PERIDEBT,
            stable: stableDEBT,
            
        },
        PERI: {
            ...currencies['PERI'],
            balance: periBalance,
            staked: PERIStaked,
            stakable: PERIStakable,
            transferable: transferablePERI,
            rewardEscrow: PERIRewardEscrow,
            
        },
        pUSD: {
            ...currencies['pUSD'],
            balance: pUSDBalance,
            transferable: pUSDBalance,
            
        },
        USDC: {
            ...currencies['USDC'],
            balance: USDCBalance + stakedUSDC,
            transferable: USDCBalance,
            staked: stakedUSDC,
            stakable: USDCStakable,
            mintable: stakeAble ? mintableStable : 0n,
            allowance: USDCAllowance,
            
        },
        DAI: {
            ...currencies['DAI'],
            balance: DAIBalance + stakedDAI,
            transferable: DAIBalance,
            staked: stakedDAI,
            mintable: stakeAble ? mintableStable : 0n,
            stakable: DAIStakable,
            allowance: DAIAllowance,
            
        },
        LP: {
            ...currencies['LP'],
            balance: LPBalance + stakedLP,
            transferable: LPBalance,
            allowance: LPAllowance,
            staked: stakedLP,
            stakable: LPBalance,
            rewardEscrow: LPRewardEscrow,
        },
    }
}