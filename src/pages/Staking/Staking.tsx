import { useEffect, useState, useCallback} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from 'config/reducers'
import { updateTransaction } from 'config/reducers/transaction'
import { pynthetix, getEstimateCRatio, getStakingAmount, getCurrencyFormat, USDC } from 'lib'
import { utils } from 'ethers'
import { useHistory } from 'react-router-dom'
import { setIsLoading } from 'config/reducers/app'

import numbro from 'numbro'

import styled from 'styled-components'
import Action from 'screens/Action'
import Input from 'components/Input'
import { BlueGreenButton, LightBlueButton } from 'components/Button'
import { H4, H5 } from 'components/Text'
import Fee from 'components/Fee'
import { ActionContainer } from 'components/Container'

import { gasPrice } from 'helpers/gasPrice'

type StakingData = {
    maxIssuable: string, 
    debtBalanceOf: string, 
    PERIBalance: string, 
    issuanceRatio: string, 
    exchangeRates: {
        PERI: string,
        USDC: string,
    }, 
    issuable: {
        pUSD: string,
        USDC: string
    },
    USDCBalance: string
}

const Staking = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    
    const [stakingData, setStakingData] = useState<StakingData>({
        maxIssuable: "0",
        debtBalanceOf: "0",
        PERIBalance: "0",
        issuanceRatio: "0",
        exchangeRates: {
            PERI: "0",
            USDC: "0",
        },
        issuable: {
            pUSD: "0",
            USDC: "0"
        },
        USDCBalance: "0"
    });
    const [estimateCRatio, setEstimateCRatio] = useState<string>("0");
    const [stakingPERIAmount, setStakingPERIAmount] = useState<string>("0");
    const [stakingUSDCAmount, setStakingUSDCAmount] = useState<string>("0");
    const [useStakingUSDC, setUseStakingUSDC] = useState<boolean>(false);
    const [mintingAmount, setMintingAmount] = useState<string>("0");
    const [gasLimit, setGasLimit] = useState<number>(0);

    const { js: { PeriFinance, Issuer, ExchangeRates } }  = pynthetix as any;
    const { PERIBalance, debtBalanceOf, exchangeRates, issuanceRatio, issuable, USDCBalance } = stakingData;

    const currenciesToBytes = {
        PERI: utils.formatBytes32String('PERI'),
        pUSD: utils.formatBytes32String('pUSD'),
        USDC: utils.formatBytes32String('USDC'),
    }
    const getIssuanceData = useCallback(async () => {
        dispatch(setIsLoading(true));
        try {
            const maxIssuable = utils.formatEther(await PeriFinance.maxIssuablePynths(currentWallet, currenciesToBytes['pUSD']));
            const debtBalanceOf = utils.formatEther(await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes['pUSD']));
            const PERIBalance = utils.formatEther(await PeriFinance.collateral(currentWallet));
            const issuanceRatio = utils.formatEther(await Issuer.issuanceRatio());
            const exchangeRates = {
                PERI: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['PERI'])),
                USDC: utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['USDC'])) && "0.90",
            }
            
            const issuableUSDC = numbro(debtBalanceOf).add(numbro(mintingAmount).value())
                .multiply(0.2).divide(numbro(issuanceRatio).value()).divide(numbro(exchangeRates['USDC']).value()).value();
            
            const USDCBalance = (await USDC.balanceOf(currentWallet)).toString();

            const issuable = {
                pUSD: utils.formatEther((await PeriFinance.remainingIssuablePynths(currentWallet))[0].toString()),
                USDC: numbro(USDCBalance).subtract(issuableUSDC).value() > 0 ? 
                    issuableUSDC.toString() : USDCBalance.toString()
            }
            
            USDC.allowance(currentWallet);
            setStakingData({ maxIssuable, debtBalanceOf, PERIBalance, issuanceRatio, exchangeRates, issuable, USDCBalance});
            
        } catch (e) {
            console.log(e);
        }
        dispatch(setIsLoading(false));
        // eslint-disable-next-line
    }, [currentWallet])

    useEffect(() => {
        const init = async() => {
            await getIssuanceData();
        }
        
        init();
        return () => {
            setStakingData({
                maxIssuable: "0",
                debtBalanceOf: "0",
                PERIBalance: "0",
                issuanceRatio: "0",
                exchangeRates: {
                    PERI: "0",
                    USDC: "0",
                },
                issuable: {
                    pUSD: "0",
                    USDC: "0",
                },
                USDCBalance: "0"
            })
        };
        // eslint-disable-next-line
    } ,[currentWallet]);

    const setAmount = (event) => {
        let value = event.target.value;
        if(!value) {
            value = 0;
        }
        if(useStakingUSDC) {
            const issuableUSDCtoUSDT = numbro(stakingUSDCAmount).clone().multiply(numbro(issuanceRatio).value())
                .multiply(numbro(exchangeRates['USDC']).value()).value();
            if(numbro(value).clone().subtract(numbro(issuableUSDCtoUSDT).value()).value() < 0) {
                value = issuableUSDCtoUSDT;
            }
        }
        
        if(numbro(issuable['pUSD']).clone().subtract(numbro(value).value()).value() < 0 ) {
            value = issuable['pUSD'];
        }

        setEstimateCRatio(getEstimateCRatio({ PERIBalance, debtBalanceOf, exchangeRates, mintingAmount: value}));
        setStakingPERIAmount(getStakingAmount({issuanceRatio, exchangeRates, mintingAmount: value, stakingUSDCAmount}));
        setMintingAmount(value);
        getGasEstimate();
    }

    const setAmountMax = () => {
        const issuableUSDCtoUSDT = numbro(stakingUSDCAmount).clone().multiply(numbro(issuanceRatio).value())
            .multiply(numbro(exchangeRates['USDC']).value()).value();
        
        let currentMaxUSDTAmount = !isNaN(Number(issuableUSDCtoUSDT)) && issuableUSDCtoUSDT ? numbro(issuable['pUSD']).add(issuableUSDCtoUSDT).value() : issuable['pUSD'];

        setMintingAmount(getCurrencyFormat(currentMaxUSDTAmount));
        setEstimateCRatio(getEstimateCRatio({ PERIBalance, debtBalanceOf, exchangeRates, mintingAmount: currentMaxUSDTAmount}));
        setStakingPERIAmount(getStakingAmount({issuanceRatio, exchangeRates, mintingAmount: currentMaxUSDTAmount, stakingUSDCAmount}));
        getGasEstimate();
    }

    const setUSDCAmount = (event) => {
        let value = event.target.value;
        let currentMaxUSDCAmount = 0;
        if(useStakingUSDC) {
            const issuableUSDC = numbro(mintingAmount).multiply(0.2).divide(numbro(issuanceRatio).value())
            .divide(numbro(exchangeRates['USDC']).value()).value();

            let currentMaxUSDCAmount = numbro(issuable['USDC']).add(issuableUSDC).value(); 

            if(numbro(currentMaxUSDCAmount).clone().subtract(numbro(value).value()).value() < 0 ) {
                value = currentMaxUSDCAmount;
            }   
        }
        if(numbro(USDCBalance).subtract(numbro(currentMaxUSDCAmount).value()).value() < 0 ) {
            value = USDCBalance;
        }

        setStakingUSDCAmount(value);
        setStakingPERIAmount( getStakingAmount({ issuanceRatio, exchangeRates, mintingAmount, stakingUSDCAmount: value }));
        getGasEstimate();
    }

    const setUSDCAmountMax = () => {
        
        const issuableUSDC = numbro(mintingAmount).multiply(0.2).divide(numbro(issuanceRatio).value())
            .divide(numbro(exchangeRates['USDC']).value()).value();

        let currentMaxUSDCAmount = !isNaN(Number(issuableUSDC)) && issuableUSDC ? numbro(issuable['USDC']).add(issuableUSDC).value() : issuable['USDC'];

        if(numbro(USDCBalance).subtract(numbro(currentMaxUSDCAmount).value()).value() < 0 ) {
            currentMaxUSDCAmount = USDCBalance;
        }

        setStakingUSDCAmount(getCurrencyFormat(currentMaxUSDCAmount));
        setStakingPERIAmount(getStakingAmount({ issuanceRatio, exchangeRates, mintingAmount, stakingUSDCAmount: currentMaxUSDCAmount}));
        getGasEstimate();
    } 

    const getGasEstimate = async () => {
        
        let estimateGasLimit;

        try {
            if(useStakingUSDC) {
                if(numbro(mintingAmount).value().toString() === issuanceRatio) {
                    estimateGasLimit = await PeriFinance.contract.estimate.issueMaxPynths()
                } else {
                    estimateGasLimit = await PeriFinance.contract.estimate.issuePynths(
                        utils.parseEther(numbro(mintingAmount).value().toString())
                    )
                }
            } else {
                estimateGasLimit = await PeriFinance.contract.estimate.stakeUSDCAndIssuePynths(
                    numbro(stakingUSDCAmount).multiply(10**6).value().toString(),
                    utils.parseEther(numbro(mintingAmount).value().toString())
                )   
            }
            setGasLimit(numbro(estimateGasLimit).multiply(1.2).value());
        } catch(e) {
            console.log(e);
        }
    }

    const onSaking = async () => {
        dispatch(setIsLoading(true));
        
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit,
        }
        if(useStakingUSDC) {
            try {
                
                let transaction;
                if(numbro(mintingAmount).value().toString() === issuable['pUSD'] && numbro(stakingUSDCAmount).value().toString() === issuable['USDC']) {
                    transaction = await PeriFinance.stakeMaxUSDCAndIssuePynths(transactionSettings);
                } else {
                    transaction = await PeriFinance.stakeUSDCAndIssuePynths(
                        numbro(stakingUSDCAmount).multiply(10**6).value().toString(),
                        utils.parseEther(numbro(mintingAmount).value().toString()),
                        transactionSettings
                    );
                }
                
                dispatch(updateTransaction(
                    {
                        hash: transaction.hash,
                        message: `Staked & Minted ${getCurrencyFormat(mintingAmount)} pUSD ${getCurrencyFormat(stakingUSDCAmount)} USDC`,
                        type: 'Staked & Minted'
                    }
                ));
                history.push('/')
            } catch(e) {
                console.log(e);
            }   

        } else {
            try {
                let transaction;
                if(numbro(mintingAmount).value().toString() === issuable['pUSD']) {
                    transaction = await PeriFinance.issueMaxPynths(transactionSettings);
                } else {
                    transaction = await PeriFinance.issuePynths(
                        utils.parseEther(numbro(mintingAmount).value().toString()),
                        transactionSettings
                    );
                }
                history.push('/');
                dispatch(updateTransaction(
                    {
                        hash: transaction.hash,
                        message: `Staked & Minted ${getCurrencyFormat(mintingAmount)} pUSD`,
                        type: 'Staked & Minted'
                    }
                ));
                
            } catch(e) {
                console.log(e);
            }   
            
        }
        dispatch(setIsLoading(false));
        
    }

    return (
        <Action title="STAKING"
            subTitles={[
                "Mint pUSD by staking your PERI.",
                "This gives you a Collateralization Ratio and a debt, allowing you to earn staking rewards."
            ]}
        >
            <ActionContainer>
                <div>
                    <StakingInfoContainer>
                        <UseUSDCButton onClick={() => setUseStakingUSDC(!useStakingUSDC)}>
                            <H5 color={'red'}>{useStakingUSDC ? 'disable USDC' : 'use USDC'}</H5>
                        </UseUSDCButton>
                        <H5>Estimated C-Ratio: {estimateCRatio}%</H5>
                    </StakingInfoContainer>
                    <Input key="pUSD"
                        currencyName="pUSD"
                        value={mintingAmount}
                        onChange={setAmount}
                        onBlur={() => setMintingAmount(getCurrencyFormat(mintingAmount))}
                        maxAction={() => setAmountMax()}
                    />
                    {useStakingUSDC && <Input key="USDC"
                        currencyName="USDC"
                        value={stakingUSDCAmount}
                        onChange={setUSDCAmount}
                        onBlur={() => setMintingAmount(getCurrencyFormat(stakingUSDCAmount))}
                        maxAction={() => setUSDCAmountMax()}
                    />}
                    <Input key="PERI"
                        currencyName="PERI"
                        disabled= {true}
                        value={stakingPERIAmount}
                    />                    
                </div>
                <div>
                    <StakingButton onClick={ () => onSaking()}><H4 weigth="bold">STAKE & MAINT</H4></StakingButton>
                    <Fee gasPrice={seletedFee.price} gasLimit={gasLimit}/>
                </div>
            </ActionContainer>
        </Action>
        
    );
}

const StakingInfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const StakingButton = styled(BlueGreenButton)`
    width: 100%;
    height: 50px;
`

const UseUSDCButton = styled(LightBlueButton)`
    height: 30px;
    padding: 0px 20px;
`
export default Staking;