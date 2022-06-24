import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { RootState } from 'config/reducers'
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';

import { H1 } from 'components/heading'
import { MintCard } from 'components/card/MintCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel, Virtual } from 'swiper/core';
import { utils } from 'ethers'
import { contracts }  from 'lib/contract'
import { formatCurrency } from 'lib'
import { updateBalances } from 'config/reducers/wallet'
import { updateTransaction } from 'config/reducers/transaction'
import { setLoading } from 'config/reducers/loading'
import { onboard } from 'lib/onboard'
import { getTotalDebtCache } from 'lib/balance'
import { getLpRewards } from 'lib/reward'

SwiperCore.use([Mousewheel, Virtual]);

const currencies = [
    {name: 'PERI', isStable: false},
    {name: 'USDC', isStable: true},
    {name: 'DAI', isStable: true}
]

const Mint = () => {
    const dispatch = useDispatch();
    const balancesIsReady = useSelector((state: RootState) => state.balances.isReady);
    const exchangeIsReady = useSelector((state: RootState) => state.exchangeRates.isReady);
    const { balances } = useSelector((state: RootState) => state.balances);
    const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
    const { targetCRatio } = useSelector((state: RootState) => state.ratio);
    const { hash } = useSelector((state: RootState) => state.transaction);
    const { gasPrice } = useSelector((state: RootState) => state.networkFee);

    const { isConnect, networkId } = useSelector((state: RootState) => state.wallet);
    const [ slideIndex, setSlideIndex ] = useState(0);
    const [ activeCurrency, setActiveCurrency] = useState(null);
    const [ maxStakeAmount, setMaxStakeAmount ] = useState('0');
    const [ maxMintAmount, setMaxMintAmount ] = useState('0');
    const [ mintAmount, setMintAmount ] = useState('0');
    const [ stakeAmount, setStakeAmount ] = useState('0');
    const [ isApprove, setIsApprove ] = useState(false);
    const [ rewardsAmountToAPY, setRewardsAmountToAPY ] = useState(0n);
    const [ cRatio, setCRatio ] = useState(0n);

    const onChangeMintAmount = (value, currencyName) => {
        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,17}/g)[0];
        }
        
        if(isNaN(Number(value)) || value === "") {
            setMintAmount('');
            setStakeAmount('');
            return false;
        }
        
        try {
            let mintAmount = value;
            let stakeAmount;

            if(BigInt(utils.parseEther(maxMintAmount).toString()) <= BigInt(utils.parseEther(mintAmount).toString())) {
                mintAmount = maxMintAmount;
                stakeAmount = maxStakeAmount;
                
            } else {
                stakeAmount = BigInt(utils.parseEther(mintAmount).toString()) * BigInt(Math.pow(10, 18).toString()) * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) / exchangeRates[currencyName];
                stakeAmount = utils.formatEther(stakeAmount.toString());
            }

            if(currencyName !== 'PERI') {
                if(BigInt(utils.parseEther(mintAmount).toString()) > balances[currencyName].allowance) {
                    setIsApprove(true);
                }
            }
            getCRatio(currencyName, mintAmount, stakeAmount)
            
            setMintAmount(mintAmount);
            setStakeAmount(stakeAmount);
        } catch(e) {
            console.log(e)
            getCRatio(currencyName, '0', '0')
            setMintAmount('');
            setStakeAmount('');
        }
    }

    const getMaxAmount = async (currency) => {

        let stakeAmount = utils.formatEther(balances[currency.name].stakeable);
        let mintAmount = utils.formatEther(BigInt(balances[currency.name].stakeable) * exchangeRates[currency.name] / BigInt(Math.pow(10, 18).toString()) / (BigInt(Math.pow(10, 18).toString()) / targetCRatio));
         
        setMaxStakeAmount(stakeAmount);
        setMaxMintAmount(mintAmount);
    }

    const getGasEstimate = async () => {
        let gasLimit = 600000n;
        dispatch(setLoading({name: 'gasEstimate', value: true}));
        try {
            gasLimit = BigInt((await contracts.signers.PeriFinance.estimateGas.issuePynths(
                utils.formatBytes32String(activeCurrency.name),
                utils.parseEther(mintAmount)
            )).toString());
        } catch(e) {
            console.log(e);
        }
        dispatch(setLoading({name: 'gasEstimate', value: false}));
        return (gasLimit * 12n /10n).toString()
    }
    
    const approveAction = async (currencyName) => {
        const amount = BigInt('11579208923731619542357098500868790785326998466');
        const transaction = await contracts.signers[currencyName].approve(contracts?.addressList['ExternalTokenStakeManager'].address, amount.toString());
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

    const mintAction = async () => {
        if(!isConnect) {
            await connectHelp();
            return false;
        }
        
        if(BigInt(utils.parseEther(mintAmount).toString()) === 0n) {
            NotificationManager.error(`Please enter the pUSD to mint`, 'ERROR');
            return false;
        }

        const transactionSettings = {
            gasPrice: gasPrice.toString(),
            gasLimit: await getGasEstimate(),
        }
        
        try {
            let transaction;
            transaction = await contracts.signers.PeriFinance.issuePynths(              
                utils.formatBytes32String(activeCurrency.name),
                utils.parseEther(mintAmount),
                transactionSettings
            );
            
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `${activeCurrency.name} Staking & Minting ${formatCurrency(BigInt(utils.parseEther(mintAmount).toString()))} pUSD`,
                    type: 'Staked & Minted'
                }
            ));
        } catch(e) {
            console.log(e);
        }    
    }

    const getAPY = async () => {
        dispatch(setLoading({name: 'apy', value: true}));
        try {
            const totalMintpUSD = await getTotalDebtCache();
            const totalLpMint = (await getLpRewards());

            let reward = ((76924n * BigInt(Math.pow(10, 18).toString())));
            
            reward = (reward - totalLpMint['total']) * exchangeRates['PERI'] * (52n) * (100n) / (totalMintpUSD.total * 4n);
            
            setRewardsAmountToAPY(reward);
        } catch(e) {
            console.log(e);
            setRewardsAmountToAPY(0n);
        }
        dispatch(setLoading({name: 'apy', value: false}));
        
        
    }

    const getCRatio = (currencyName, mintAmount, stakeAmount) => {
        
        if(mintAmount === '' || !mintAmount) {
            mintAmount = '0';
        }
        
        try {
            let mintAmountToPERI = BigInt(utils.parseEther(mintAmount).toString()) * BigInt(Math.pow(10, 18).toString()) / exchangeRates['PERI'];
            
            let totalDEBT = (balances['DEBT'].balance * BigInt(Math.pow(10, 18).toString()) / exchangeRates['PERI']) + mintAmountToPERI;
            
            const USDCTotalStake = currencyName === 'USDC' ? balances['USDC'].staked + BigInt(utils.parseEther(stakeAmount).toString()) : balances['USDC'].staked;
            const USDCStakedToPERI = (USDCTotalStake * exchangeRates['USDC']) / exchangeRates['PERI'];

            const DAITotalStake = currencyName === 'DAI' ? balances['DAI'].staked + BigInt(utils.parseEther(stakeAmount).toString()) : balances['DAI'].staked;
            const DAIStakedToPERI = (DAITotalStake * exchangeRates['DAI']) / exchangeRates['PERI'];
            
            setCRatio( BigInt(Math.pow(10, 18).toString()) * 100n / (totalDEBT * BigInt(Math.pow(10, 18).toString()) / (balances['PERI'].balance + DAIStakedToPERI + USDCStakedToPERI)));
        } catch(e) {
            setCRatio(0n);
        }
    }

    useEffect(() => {
        if(!hash) {
            setMintAmount('0');
            setStakeAmount('0');
            getCRatio(currencies[slideIndex].name, '0', '0');
        }
    }, [hash]);

    useEffect(() => {
        if(exchangeIsReady) {
            getAPY();
        }
    }, [exchangeIsReady, networkId,]);


    useEffect(() => {
        if(exchangeIsReady) {
            if(balancesIsReady && isConnect) {
                getMaxAmount(currencies[slideIndex]);
                getCRatio(currencies[slideIndex].name, mintAmount, stakeAmount);
            } else {
                setMaxStakeAmount('0');
                setMaxMintAmount('0');
                setCRatio(0n);
            }
        }
    }, [exchangeIsReady, balancesIsReady, exchangeRates, balances, isConnect])

    useEffect(() => {
        if(slideIndex !== null) {
            setActiveCurrency(currencies[slideIndex]);
            setIsApprove(false);
            setMintAmount('0');
            setStakeAmount('0');
            getCRatio(currencies[slideIndex].name, '0', '0');
        }
    }, [slideIndex])

    useEffect(() => {
        if(slideIndex !== null && exchangeIsReady && balancesIsReady) {
            getMaxAmount(currencies[slideIndex]);
        }
    }, [slideIndex, exchangeIsReady, balancesIsReady])

    return (
        <Container>
            {slideIndex === 0 && <Title> <H1>MINT</H1> </Title>}
            
            
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
                onSlideChange={({activeIndex}) => {setSlideIndex(activeIndex)}}
                virtual
                >
                {currencies.map((currency, index) => (
                    <SwiperSlide key={currency.name} virtualIndex={index}>
                        <MintCard isActive={index === slideIndex} currencyName={currency.name}
                                maxAction={() => isConnect ? onChangeMintAmount(maxMintAmount, currency.name) : connectHelp() }
                                stakeAmount={stakeAmount}
                                mintAmount={mintAmount}
                                onChange={onChangeMintAmount}
                                apy={rewardsAmountToAPY}
                                cRatio={cRatio}
                                isApprove={isApprove} approveAction={() => approveAction(currency.name)} mintAction={() => mintAction()}
                        ></MintCard> 
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


export default Mint;