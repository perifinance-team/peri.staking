import { useEffect, useState, useCallback} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from 'config/reducers'

import { setIsLoading } from 'config/reducers/app'
import { updateTransaction } from 'config/reducers/transaction'

import { StakingData, getStakingData, pynthetix, getEstimateCRatio, getStakingAmount, getCurrencyFormat, USDC } from 'lib'
import { utils } from 'ethers'
import { useHistory } from 'react-router-dom'
import { gasPrice } from 'helpers/gasPrice'

import numbro from 'numbro'

import styled from 'styled-components'
import Action from 'screens/Action'
import Input from 'components/Input'
import { BlueGreenButton, LightBlueButton } from 'components/Button'
import { H4, H5 } from 'components/Text'
import Fee from 'components/Fee'
import { ActionContainer } from 'components/Container'

const Staking = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    
    const [stakingData, setStakingData] = useState<StakingData>();
    const [estimateCRatio, setEstimateCRatio] = useState<string>("0");
    const [stakingAmount, setStakingAmount] = useState<{PERI?: string, USDC?: string}>({
        PERI: "0",
        USDC: "0"
    });

    const [maxStakingAmount , setMaxStakingAmount] = useState<{USDC?: string}>({
        USDC: "0"
    });

    const [mintingAmount, setMintingAmount] = useState<{pUSD: string}>({
        pUSD: "0"
    });
    
    const [maxMintingAmount, setMaxMintingAmount] = useState<{pUSD: string}>({
        pUSD: "0"
    });

    const [useStakingUSDC, setUseStakingUSDC] = useState<boolean>(false);

    const [gasLimit, setGasLimit] = useState<number>(0);

    const { js: { PeriFinance } }  = pynthetix as any;

    const getIssuanceData = useCallback(async () => {
        dispatch(setIsLoading(true));
        const data = await getStakingData(currentWallet);
        setStakingData(data);
        setMaxMintingAmount({
            pUSD: data.issuable['pUSD']
        });
        setMaxStakingAmount({
            USDC: data.stakeable['USDC']
        });
        // USDC.allowance(currentWallet);
        dispatch(setIsLoading(false));
        // eslint-disable-next-line
    }, [currentWallet])

    useEffect(() => {
        const init = async() => {
            await getIssuanceData();
        }
        
        init();
        // eslint-disable-next-line
    } ,[currentWallet]);
    
    const maxAmountCheckToBalance = (amount, currency) => {
        if(currency === 'pUSD') {
            return numbro(stakingData.balances['pUSD']).clone().subtract(numbro(amount).value()).value() > 0
        } else if (currency === 'USDC') {
            return numbro(stakingData.balances['USDC']).clone().subtract(numbro(amount).value()).value() > 0
        }
    }

    const getMaxStakeableUSDC = (pUSDAmount) => {
        const inputStakeable = numbro(pUSDAmount).clone().divide(numbro(stakingData.issuanceRatio).value())
                .divide(numbro(stakingData.exchangeRates['USDC']).value());
        const maxStakeableUSDC = numbro(stakingData.stakeable['USDC']).add(inputStakeable.value());
        return maxStakeableUSDC;
    }

    const setMintAmount = (value, isMax = false) => {
        value = value.replace(/\,/g, '');
        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,2}/g)[0];
        }
        
        if(isNaN(Number(value)) || value === "") {
            setMintingAmount({pUSD: ''});
            setMaxStakingAmount({USDC: getCurrencyFormat(stakingData.stakeable['USDC'])});
            setStakingAmount( { PERI: "0.00", USDC: getCurrencyFormat(stakingData.stakeable['USDC']) } );

            setEstimateCRatio(getEstimateCRatio(
                { 
                    PERITotalBalance: stakingData.balances['PERITotal'], 
                    debtBalanceOf: stakingData.balances['debt'],
                    exchangeRates: stakingData.exchangeRates,
                    mintingAmount: 0,
                    stakedAmount: stakingData.stakedAmount['USDC'],
                    stakingAmount: stakingAmount['USDC']
                }
            ));

            return false;
        }

        if(numbro(stakingData.allowance['USDC']))

        if(numbro(stakingData.issuable['pUSD']).clone().subtract(numbro(value).value()).value() < 0 ) {
            value = getCurrencyFormat(stakingData.issuable['pUSD']);
        }

        const maxStakeableUSDC = getMaxStakeableUSDC(value);
        let stakingAmountUSDC = stakingAmount['USDC'];

        if(maxAmountCheckToBalance(maxStakeableUSDC, 'USDC')) {
            setMaxStakingAmount({USDC: getCurrencyFormat(maxStakeableUSDC)});

            if(numbro(maxStakeableUSDC).subtract(numbro(stakingAmount['USDC']).value()).value() < 0) {
                stakingAmountUSDC = maxStakeableUSDC.value().toString();
            }

        } else {
            setMaxStakingAmount({USDC: getCurrencyFormat(stakingData.balances['USDC'])});
        }

        
    
        setEstimateCRatio(getEstimateCRatio(
            { 
                PERITotalBalance: stakingData.balances['PERITotal'], 
                debtBalanceOf: stakingData.balances['debt'],
                exchangeRates: stakingData.exchangeRates,
                mintingAmount: value,
                stakedAmount: stakingData.balances['USDC'],
                stakingAmount: stakingAmountUSDC
            }
        ));
        
        setStakingAmount(
            {   
                USDC: getCurrencyFormat(stakingAmountUSDC),
                PERI: getStakingAmount({
                    issuanceRatio: stakingData.issuanceRatio,
                    exchangeRates: stakingData.exchangeRates,
                    mintingAmount: value,
                    stakingUSDCAmount: stakingAmountUSDC
                }),
            }
        );
        
        setMintingAmount({pUSD: isMax ? getCurrencyFormat(value) : value});
        getGasEstimate();
    }

    const setAmountMax = () => {
        setMintAmount(maxMintingAmount['pUSD'], true);
    }

    const setUSDCAmount = (value, isMax = false) => {
        value = value.replace(/\,/g, '');
        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,2}/g)[0];
        }
        if(isNaN(Number(value)) || value === "") {
            setStakingAmount({
                USDC: '',
                PERI: getStakingAmount({
                    issuanceRatio: stakingData.issuanceRatio,
                    exchangeRates: stakingData.exchangeRates,
                    mintingAmount: mintingAmount['pUSD'],
                    stakingUSDCAmount: 0
                }),
            });

            setEstimateCRatio(getEstimateCRatio(
                { 
                    PERITotalBalance: stakingData.balances['PERITotal'], 
                    debtBalanceOf: stakingData.balances['debt'],
                    exchangeRates: stakingData.exchangeRates,
                    mintingAmount: mintingAmount['pUSD'],
                    stakedAmount: stakingData.balances['USDC'],
                    stakingAmount: 0
                }
            ));
            
            setMaxMintingAmount({pUSD: getCurrencyFormat(stakingData.issuable['pUSD'])});
            return false;
        }
        
        if(numbro(maxStakingAmount['USDC']).subtract(numbro(value).value()).value() < 0) {
            value = getCurrencyFormat(maxStakingAmount['USDC']);
        }
        
        if(numbro(stakingData.balances['USDC']).subtract(numbro(value).value()).value() < 0 ) {
            value = getCurrencyFormat(stakingData.balances['USDC'])
        }

        setEstimateCRatio(getEstimateCRatio(
            { 
                PERITotalBalance: stakingData.balances['PERITotal'], 
                debtBalanceOf: stakingData.balances['debt'],
                exchangeRates: stakingData.exchangeRates,
                mintingAmount: mintingAmount['pUSD'],
                stakedAmount: stakingData.balances['USDC'],
                stakingAmount: value
            }
        ));

        setStakingAmount({
            USDC: isMax ? getCurrencyFormat(value) : (value),
            PERI: getStakingAmount({
                issuanceRatio: stakingData.issuanceRatio,
                exchangeRates: stakingData.exchangeRates,
                mintingAmount: mintingAmount['pUSD'],
                stakingUSDCAmount: value
            }),
        });
    }

    const setUSDCAmountMax = () => {
        setUSDCAmount(maxStakingAmount['USDC'], true);
    } 

    const getGasEstimate = async () => {
        
        let estimateGasLimit;
        const mintAmount = Number(numbro(maxMintingAmount['pUSD']).subtract(numbro(mintingAmount['pUSD']).value()).format({mantissa: 2}));
        const stakeUSDCAmount = Number(numbro(maxStakingAmount['USDC']).subtract(numbro(maxStakingAmount['USDC']).value()).format({mantissa: 2}));
        try {
            if(useStakingUSDC) {
                if(mintAmount === 0 && stakeUSDCAmount === 0) {
                    estimateGasLimit = await PeriFinance.contract.estimate.stakeMaxUSDCAndIssuePynths();
                } else {
                    estimateGasLimit = await PeriFinance.contract.estimate.stakeUSDCAndIssuePynths(
                        numbro(stakingAmount['USDC']).multiply(10**6).value().toString(),
                        utils.parseEther(numbro(mintingAmount['pUSD']).value().toString())
                    );
                }
            } else {
                if(mintAmount === 0) {
                    estimateGasLimit = await PeriFinance.contract.estimate.issueMaxPynths();
                } else {
                    estimateGasLimit = await PeriFinance.contract.estimate.issuePynths(
                        utils.parseEther(numbro(mintingAmount['pUSD']).value().toString())
                    );
                }
            }
            setGasLimit(numbro(estimateGasLimit).multiply(1.2).value());
            
        } catch(e) {
            console.log(e);
            estimateGasLimit = 210000;
        }
        return numbro(estimateGasLimit).multiply(1.2).value();
    }

    const onSaking = async () => {
        dispatch(setIsLoading(true));
        
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit: await getGasEstimate(),
        }
        console.log(transactionSettings);

        const mintAmount = Number(numbro(maxMintingAmount['pUSD']).subtract(numbro(mintingAmount['pUSD']).value()).format({mantissa: 2}));
        const stakeUSDCAmount = Number(numbro(maxStakingAmount['USDC']).subtract(numbro(maxStakingAmount['USDC']).value()).format({mantissa: 2}));

        if(useStakingUSDC) {
            try {
                let transaction;
                
                if(mintAmount === 0 && stakeUSDCAmount === 0) {
                    transaction = await PeriFinance.stakeMaxUSDCAndIssuePynths(transactionSettings);
                } else {
                    transaction = await PeriFinance.stakeUSDCAndIssuePynths(
                        numbro(stakingAmount['USDC']).multiply(10**6).value().toString(),
                        utils.parseEther(numbro(mintingAmount['pUSD']).value().toString()),
                        transactionSettings
                    );
                }

                dispatch(updateTransaction(
                    {
                        hash: transaction.hash,
                        message: `Staked & Minted ${getCurrencyFormat(mintingAmount['pUSD'])} pUSD ${getCurrencyFormat(stakingAmount['USDC'])} USDC`,
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
                if(mintAmount === 0) {
                    transaction = await PeriFinance.issueMaxPynths(transactionSettings);
                } else {
                    transaction = await PeriFinance.issuePynths(
                        utils.parseEther(numbro(mintingAmount['pUSD']).value().toString()),
                        transactionSettings
                    );
                }
                history.push('/');
                dispatch(updateTransaction(
                    {
                        hash: transaction.hash,
                        message: `Staked & Minted ${getCurrencyFormat(mintingAmount['pUSD'])} pUSD`,
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
                        <UseUSDCButton onClick={() => {setUseStakingUSDC(!useStakingUSDC); setStakingAmount({USDC: "0.00"})} }>
                            <H5 color={'red'}>{useStakingUSDC ? 'disable USDC' : 'use USDC'}</H5>
                        </UseUSDCButton>
                        <H5>Estimated C-Ratio: {estimateCRatio}%</H5>
                    </StakingInfoContainer>
                    
                    <Input key="pUSD"
                        currencyName="pUSD"
                        value={mintingAmount['pUSD']}
                        onChange={(event) => setMintAmount(event.target.value)}
                        onBlur={() => setMintingAmount({pUSD: getCurrencyFormat(mintingAmount['pUSD'])})}
                        maxAction={() => setAmountMax()}
                        maxAmount={maxMintingAmount['pUSD']}
                    />
                    <Input key="USDC"
                        currencyName="USDC"
                        value={stakingAmount['USDC']}
                        disabled={!useStakingUSDC}
                        onChange={(event) => setUSDCAmount(event.target.value)}
                        // onBlur={() => setStakingAmount(getCurrencyFormat(stakingAmount['USDC']))}
                        maxAction={() => setUSDCAmountMax()}
                        maxAmount={useStakingUSDC ? maxStakingAmount['USDC'] : undefined}
                    />
                    <Input key="PERI"
                        currencyName="PERI"
                        disabled= {true}
                        value={stakingAmount['PERI']}
                    />                    
                </div>
                <div>
                    <StakingButton onClick={ () => onSaking()}><H4 weigth="bold">STAKE & MINT</H4></StakingButton>
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