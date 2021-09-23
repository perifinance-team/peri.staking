import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { RootState } from 'config/reducers'
import { NotificationManager } from 'react-notifications';

import styled, { css } from 'styled-components';
import { H1 } from 'components/headding'
import { EarnCard } from 'components/card/EarnCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel, Virtual } from 'swiper/core';
import { utils } from 'ethers';
import { updateBalances } from 'config/reducers/wallet'
import { updateTransaction } from 'config/reducers/transaction'
import { contracts } from 'lib/contract'
import { onboard } from 'lib/onboard'
import { getExchangeRatesLP } from 'lib/rates'
import { getLpRewards } from 'lib/reward'
import { setLoading } from 'config/reducers/loading'

SwiperCore.use([Mousewheel, Virtual]);
const Earn = () => {
    const dispatch = useDispatch();
    const balancesIsReady = useSelector((state: RootState) => state.balances.isReady);
    const exchangeIsReady = useSelector((state: RootState) => state.exchangeRates.isReady);
    const { hash } = useSelector((state: RootState) => state.transaction);
    const [slideIndex, setSlideIndex] = useState(0);
    const { balances } = useSelector((state: RootState) => state.balances);
    const { address, networkId } = useSelector((state: RootState) => state.wallet);
    const { isConnect, confirm } = useSelector((state: RootState) => state.wallet);
    const { gasPrice } = useSelector((state: RootState) => state.networkFee);
    const [ stakeAmount, setStakeAmount ] = useState('0');
    const [ maxStakeAmount, setMaxStakeAmount ] = useState('0');
    const [ isApprove, setIsApprove ] = useState(false);
    const [ rewardsAmountToAPY, setRewardsAmountToAPY ] = useState(0n);

    const coins = [
        {name: 'LP', isStable: true}
    ]

    const onChageStakingAmount = (value, currencyName) => {
        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,17}/g)[0];
        }
        
        if(isNaN(Number(value)) || value === "") {
            setStakeAmount('');
            return false;
        }
        let stakeAmount = value;

        if(BigInt(utils.parseEther(maxStakeAmount).toString()) < BigInt(utils.parseEther(stakeAmount).toString())) {
            stakeAmount = maxStakeAmount;
            
        } 

        if(BigInt(utils.parseEther(stakeAmount).toString()) > balances[currencyName].allowance) {
            
            setIsApprove(true);
        }
        
        setStakeAmount(stakeAmount);
    }

    const approveAction = async (currencyName) => {
        const amount = BigInt('11579208923731619542357098500868790785326998466');
        const transaction = await contracts[currencyName].approve();
        NotificationManager.info('Approve', 'In progress', 0);

        const getState = async () => {
            await contracts.provider.once(transaction.hash, async (transactionState) => {
                if(transactionState.status === 1) {
                    NotificationManager.remove(NotificationManager.listNotify[0])
                    NotificationManager.success(`Approve success`, 'SUCCESS');
                    dispatch(updateBalances({currencyName, value: 'allowance', amount}))
                    setIsApprove(false);
                }
            });
        }
        getState();  
    }

    const connectHelp = async () => {
        NotificationManager.error(`Please connect your wallet first`, 'ERROR');
        try {
            await onboard.walletSelect();
            await onboard.walletCheck();
        } catch(e) {
        }
         
    }

    const getAPY = async () => {
        dispatch(setLoading({name: 'apy', value: true}));
        try {
            const {PERIBalance, PoolTotal} = await getExchangeRatesLP(networkId);
            const lpRewards = (await getLpRewards());
            const totalStakeAmount = BigInt((await contracts['LP'].totalStakeAmount()).toString());

            const reward = BigInt(lpRewards[networkId]) * BigInt(Math.pow(10, 18).toString()) * (52n) * (100n) / (totalStakeAmount * PERIBalance / PoolTotal);
            
            setRewardsAmountToAPY(reward);
        } catch(e) {
            console.log(e);
            setRewardsAmountToAPY(0n);
        }
        dispatch(setLoading({name: 'apy', value: false}));
        
    }

    const getGasEstimate = async () => {
        let gasLimit = 600000n;
        dispatch(setLoading({name: 'gasEstimate', value: true}));
        try {
            gasLimit = BigInt((await contracts.signers.LP.contract.estimateGas.stake(
                utils.parseEther(stakeAmount)
            )));
        } catch(e) {
            console.log(e);
        }
        dispatch(setLoading({name: 'gasEstimate', value: false}));
        return (gasLimit * 12n /10n).toString()
    }

    const stakeAction = async () => {
        if(!isConnect) {
            await connectHelp();
            return false;
        }

        if(BigInt(utils.parseEther(stakeAmount).toString()) === 0n) {
            NotificationManager.error(`Please enter the LP to staking`, 'ERROR');
            return false;
        }


        const transactionSettings = {
            gasPrice: gasPrice.toString(),
            gasLimit: await getGasEstimate(),
        }

        try {
            let transaction;
            transaction = await contracts.signers.LP.stake(utils.parseEther(stakeAmount), transactionSettings);

            
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `Stake ${stakeAmount} LP TOKEN`,
                    type: 'Stake LP'
                }
            ));
        } catch(e) {
            console.log(e);
        }    
    }

    useEffect(() => {
        if(!hash) {
            setStakeAmount('0');
        }
    }, [hash]);

    useEffect(() => {
        setIsApprove(false);
        setStakeAmount('0');
    }, [isConnect])

    useEffect(() => {
        if(slideIndex !== null) {
            setIsApprove(false);
            setStakeAmount('0');
        }
    }, [slideIndex])

    useEffect(() => {
        if(balancesIsReady && exchangeIsReady) {
            getAPY();
            if(isConnect) {
                setMaxStakeAmount(utils.formatEther(balances[coins[slideIndex].name].transferable.toString()))
            }
        }        
    }, [exchangeIsReady, balancesIsReady, balances, isConnect])

    useEffect(() => {
        if(slideIndex !== null && exchangeIsReady && balancesIsReady) {
            setMaxStakeAmount(utils.formatEther(balances[coins[slideIndex].name].transferable.toString()))
        }
    }, [slideIndex, exchangeIsReady, balancesIsReady])


    return (
        <Container>
            {slideIndex === 0 && <Title> <H1>EARN</H1> </Title>}
            <Swiper
                spaceBetween={10}
                direction={'vertical'}
                slidesPerView={4}
                centeredSlides={true}
                mousewheel={true}
                allowTouchMove={true}
                breakpoints = {
                    {'1023': {
                        allowTouchMove: false
                    }}
                }
                onSlideChange={({activeIndex}) => setSlideIndex(activeIndex)}
                virtual
                >
                {coins.map((coin, index) => (
                    <SwiperSlide key={coin.name} virtualIndex={index}> 
                        <EarnCard isActive={index === slideIndex} coinName={coin.name}
                                onChange={onChageStakingAmount}
                                apy={rewardsAmountToAPY}
                                stakeAmount={stakeAmount}
                                maxAction={() => isConnect ? onChageStakingAmount(maxStakeAmount, coin.name) : connectHelp()}
                                isApprove={isApprove} approveAction={() => approveAction(coin.name)} stakeAction={() => stakeAction()}
                        ></EarnCard> 
                    </SwiperSlide>
                ))}
            </Swiper>
            
        </Container>
    );
}

const Container = styled.div`
    flex: 1;
    height: 100%;
    position: relative;
`

const Title = styled.div`
    margin: 0 20%;
    position: absolute;
    z-index: 0;
    top: 10%;
`;


export default Earn;