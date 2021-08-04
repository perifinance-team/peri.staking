import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { RootState } from 'config/reducers'
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';
import { addSeconds, differenceInSeconds } from 'date-fns';

import { H1 } from 'components/headding'
import { BurnCard } from 'components/card/BurnCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel, Virtual } from 'swiper/core';
import { contracts } from 'lib/contract'
import { formatCurrency } from 'lib'
import { utils } from 'ethers'
import { updateTransaction } from 'config/reducers/transaction'
import { onboard } from 'lib/onboard'

SwiperCore.use([Mousewheel, Virtual]);


function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}

const secondsToTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${str_pad_left(minutes, '0', 2)}m`;
    } else if (minutes > 0) {
        return `${str_pad_left(minutes, '0', 2)} mins`;
    }
    return `up to 1 minute`;
};


const currencies = [
    {name: 'PERI', isStable: false, isLP: false},
    {name: 'USDC', isStable: true, isLP: false},
    {name: 'DAI', isStable: true, isLP: false},
    {name: 'LP', isStable: false, isLP: true}
];

const Burn = () => {
    const dispatch = useDispatch();
    const { hash } = useSelector((state: RootState) => state.transaction);
    const { balances } = useSelector((state: RootState) => state.balances);
    const balancesIsReady = useSelector((state: RootState) => state.balances.isReady);
    const exchangeIsReady = useSelector((state: RootState) => state.exchangeRates.isReady);
    const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
    const { targetCRatio, currentCRatio } = useSelector((state: RootState) => state.ratio);
    const { isConnect, address } = useSelector((state: RootState) => state.wallet);
    const { gasPrice } = useSelector((state: RootState) => state.networkFee);
    const [ issuanceDelay, setIssuanceDelay ] = useState(1);
    const [slideIndex, setSlideIndex] = useState(0);
    const [ activeCurrency, setActiveCurrency] = useState(null);
    const [ init, setInit ] = useState(false);
    const [ unStakeAmount, setUnStakeAmount ] = useState('0');
    const [ burnAmount, setBurnAmount ] = useState('0');
    const [ maxUnStakeAmount, setMaxUnStakeAmount ] = useState('0');
    const [ maxBurnAmount, setMaxBurnAmount ] = useState('0');

    const [ cRatio, setCRatio ] = useState(0n);
    
    const onChageBurnAmount = (value, currencyName) => {
        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,17}/g)[0];
        }
        
        if(isNaN(Number(value)) || value === "") {
            setUnStakeAmount('');
            setBurnAmount('');

            return false;
        }
        try {
            let burnAmount;
            let unStakeAmount;
            
            if(currencyName === 'LP') {
                unStakeAmount = value;
                if(BigInt(utils.parseEther(maxUnStakeAmount).toString()) <= BigInt(utils.parseEther(unStakeAmount).toString())) {
                    unStakeAmount = maxUnStakeAmount;   
                }
                
                setUnStakeAmount(unStakeAmount);
            } else {
                let PERIQuta = 0n;
                const isTarget: boolean = currentCRatio === 0n || currentCRatio <= 25n * BigInt(Math.pow(10, 16).toString());
                if(!isTarget) {
                    const PERIStaked = balances['DEBT'].balance * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) * BigInt(Math.pow(10, 18).toString()) / exchangeRates['PERI'];
                    PERIQuta = balances['PERI'].balance - PERIStaked;
                }
                
                burnAmount = value;
                if(BigInt(utils.parseEther(maxBurnAmount).toString()) <= BigInt(utils.parseEther(burnAmount).toString())) {
                    burnAmount = maxBurnAmount;
                    unStakeAmount = maxUnStakeAmount;
                    
                } else {
                    unStakeAmount = BigInt(utils.parseEther(burnAmount).toString()) * BigInt(Math.pow(10, 18).toString()) * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) / exchangeRates[currencyName];
                    unStakeAmount = utils.formatEther(unStakeAmount.toString());
                }
        
                if(currencyName !== 'LP') {
                    getCRatio(currencyName, burnAmount, unStakeAmount)
                }
                unStakeAmount = BigInt(utils.parseEther(unStakeAmount).toString()) + PERIQuta;

                if(unStakeAmount < 0n) {
                    unStakeAmount = '0'
                } else {
                    unStakeAmount = utils.formatEther(unStakeAmount);
                }

                setUnStakeAmount(unStakeAmount);
                setBurnAmount(burnAmount);    
            }
        } catch(e) {
            if(currencyName !== 'LP') {
                getCRatio(currencyName, '0', '0');
            }
            setUnStakeAmount('');
            setBurnAmount(''); 
        }
    }
    
    const getMaxAmount = (currency) => {
        let burnAmount;
        let unStakeAmount;
        if(currency.isLP) {
            burnAmount = 0n;
            unStakeAmount = balances['LP'].staked;
        } else {
            if(currency.isStable) {
                burnAmount = balances['DEBT'][currency.name];
                unStakeAmount = balances[currency.name].staked;
            } else {
                burnAmount = balances['DEBT'].PERI - (balances['DEBT'].stable * 4n);
                burnAmount = burnAmount < 0n ? 0n : burnAmount;
                unStakeAmount = (burnAmount * (BigInt(Math.pow(10, 18).toString()) / targetCRatio) * BigInt(Math.pow(10, 18).toString()) / exchangeRates['PERI']);
            }
        }
        
        setMaxBurnAmount(utils.formatEther(burnAmount.toString()));
        setMaxUnStakeAmount(utils.formatEther(unStakeAmount.toString()));
    }

    const connectHelp = async () => {
        NotificationManager.error(`Please connect your wallet first`, 'ERROR');
        try {
            await onboard.walletSelect();
            await onboard.walletCheck();
        } catch(e) {
        }
         
    }

    const getGasEstimate = async (currency) => {
        let gasLimit = 600000n;
        if(currency.name === "LP") {
            try {
                gasLimit = BigInt((await contracts.signers.LP.contract.estimateGas.withdraw(
                    utils.parseEther(unStakeAmount)
                )).toString());
            } catch(e) {
                console.log(e);
            }
        } else {
            try {
                gasLimit = BigInt((await contracts.signers.PeriFinance.estimateGas.burnPynths(
                    utils.formatBytes32String(activeCurrency.name),
                    utils.parseEther(burnAmount)
                )).toString());
            } catch(e) {
                console.log(e);
            }
        }
        
        
        return (gasLimit * 12n /10n).toString()
    }

    const burnAction = async (currency) => {

        if(!isConnect) {
            await connectHelp();
            return false;
        }

        const transactionSettings = {
            gasPrice: gasPrice.toString(),
            gasLimit: await getGasEstimate(currency),
        }
        let transaction;
        if(currency.name === "LP") {

            if(BigInt(utils.parseEther(unStakeAmount).toString()) === 0n) {
                NotificationManager.error(`Please enter the LP to Unstake`, 'ERROR');
                return false;
            }

            try {
                transaction = await contracts.signers.LP.withdraw(              
                    utils.parseEther(unStakeAmount),
                    transactionSettings
                );
                dispatch(updateTransaction(
                    {
                        hash: transaction.hash,
                        message: `${activeCurrency.name} unStake ${formatCurrency(BigInt(utils.parseEther(unStakeAmount).toString()))} LP`,
                        type: 'UnStake'
                    }
                ));
            } catch(e) {
                console.log(e);
            }
            
        } else {

            if(issuanceDelay !== 0) {
                NotificationManager.warning(
                    `There is a waiting period after minting before you can burn. Please wait
                    ${secondsToTime(issuanceDelay)} before attempting to burn pUSD.`, 'NOTE', 0
                )
                return false;
            }
    
            if(BigInt(utils.parseEther(burnAmount).toString()) === 0n) {
                NotificationManager.error(`Please enter the pUSD to Burn`, 'ERROR');
                return false;
            }

            try {
                transaction = await contracts.signers.PeriFinance.burnPynths(              
                    utils.formatBytes32String(activeCurrency.name),
                    utils.parseEther(burnAmount),
                    transactionSettings
                );
                dispatch(updateTransaction(
                    {
                        hash: transaction.hash,
                        message: `${activeCurrency.name} Burn ${ formatCurrency(BigInt(utils.parseEther(burnAmount).toString())) } pUSD`,
                        type: 'Burn'
                    }
                ));
            } catch(e) {
                console.log(e);
            }
        } 
        
    }

    const getCRatio = (currencyName, burnAmount, unStakeAmount) => {
        if(burnAmount === '' || !burnAmount) {
            burnAmount = '0';
        }
        
        try {
            let burnAmountToPERI = BigInt(utils.parseEther(burnAmount).toString()) * BigInt(Math.pow(10, 18).toString()) / exchangeRates['PERI'];
            
            let totalDEBT = (balances['DEBT'].balance * BigInt(Math.pow(10, 18).toString()) / exchangeRates['PERI']) - burnAmountToPERI;
            
            const USDCTotalStake = currencyName === 'USDC' ? balances['USDC'].staked - BigInt(utils.parseEther(unStakeAmount).toString()) : balances['USDC'].staked;
            const USDCStakedToPERI = (USDCTotalStake * exchangeRates['USDC']) / exchangeRates['PERI'];

            const DAITotalStake = currencyName === 'DAI' ? balances['DAI'].staked - BigInt(utils.parseEther(unStakeAmount).toString()) : balances['DAI'].staked;
            const DAIStakedToPERI = (DAITotalStake * exchangeRates['DAI']) / exchangeRates['PERI'];
            

            setCRatio( BigInt(Math.pow(10, 18).toString()) * 100n / (totalDEBT * BigInt(Math.pow(10, 18).toString()) / (balances['PERI'].balance + DAIStakedToPERI + USDCStakedToPERI)));
        } catch(e) {
            setCRatio(0n);
        }
    }

    const getIssuanceDelayCheck = async() => {
        //todo:: need improvement
        const canBurnPynths = await contracts.Issuer.canBurnPynths(address);
        const lastIssueEvent = await contracts.Issuer.lastIssueEvent(address);
        const minimumStakeTime = await contracts.Issuer.minimumStakeTime();

        if (Number(lastIssueEvent) && Number(minimumStakeTime)) {
            const burnUnlockDate = addSeconds(Number(lastIssueEvent) * 1000, Number(minimumStakeTime));
            const issuanceDelayInSeconds = differenceInSeconds(burnUnlockDate, new Date());
            setIssuanceDelay(
                issuanceDelayInSeconds > 0 ? issuanceDelayInSeconds : canBurnPynths ? 0 : 1
            );
            const issuanceDelay = issuanceDelayInSeconds > 0 ? issuanceDelayInSeconds : canBurnPynths ? 0 : 1
            
            if(issuanceDelay > 0) {
                NotificationManager.warning(
                    `There is a waiting period after minting before you can burn. Please wait
                    ${secondsToTime(issuanceDelay)} before attempting to burn pUSD.`, 'NOTE', 0
                )
            }
            return issuanceDelay;
        } else {
            return 1;
        }
    };

    

    useEffect(() => {
        if(!hash) {
            setUnStakeAmount('0');
            setBurnAmount('0');
            getCRatio(currencies[slideIndex].name, '0', '0')
        }
    }, [balancesIsReady, exchangeIsReady, isConnect, hash]);

    useEffect(() => {
        if(balancesIsReady && exchangeIsReady) {
            if(isConnect) {
                getMaxAmount(currencies[slideIndex]);
                getIssuanceDelayCheck();
                if(currencies[slideIndex].isLP) {
                    setCRatio(0n);
                } else {
                    getCRatio(currencies[slideIndex].name, burnAmount, unStakeAmount)
                }
            } else {
                setCRatio(0n);
                setMaxUnStakeAmount('0');
                setMaxBurnAmount('0');
            }
        }        
    }, [exchangeIsReady, balancesIsReady, exchangeRates, balances, isConnect])

    useEffect(() => {
        if(slideIndex !== null) {
            setActiveCurrency(currencies[slideIndex]);
            setUnStakeAmount('0');
            setBurnAmount('0');
            getCRatio(currencies[slideIndex].name, '0', '0')
        }
    }, [slideIndex]);

    useEffect(() => {
        if(slideIndex !== null && exchangeIsReady && balancesIsReady) {
            getMaxAmount(currencies[slideIndex]);
        }
    }, [slideIndex, exchangeIsReady, balancesIsReady]);

    return (
        <Container>
            {slideIndex === 0 && <Title> <H1>BURN</H1> </Title>}
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
                {currencies.map((currency, index) => (
                    <SwiperSlide key={currency.name} virtualIndex={index}> 
                        <BurnCard isActive={index === slideIndex} currencyName={currency.name}
                                maxAction={() => isConnect ? onChageBurnAmount(currency.isLP ? maxUnStakeAmount : maxBurnAmount, currency.name) : connectHelp()}
                                unStakeAmount={unStakeAmount}
                                burnAmount={burnAmount}
                                cRatio={cRatio}
                                onChange={onChageBurnAmount}
                                isLP={currency.isLP}
                                burnAction={() => burnAction(currency)}
                        ></BurnCard>
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


export default Burn;