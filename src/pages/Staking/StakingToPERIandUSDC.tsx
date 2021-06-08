import { useEffect, useState, useCallback} from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components'

import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'
import { updateTransaction } from 'config/reducers/transaction'

import { StakingData, getStakingData, pynthetix, getStakingEstimateCRatio, getStakingAmount, getStakingMaxUSDCAmount, USDC } from 'lib'
import { utils } from 'ethers'
import { useHistory } from 'react-router-dom'
import { gasPrice } from 'helpers/gasPrice'


import numbro from 'numbro'


import Input from 'components/Input'
import { BlueGreenButton } from 'components/Button'
import { H4, H5 } from 'components/Text'
import Fee from 'components/Fee'
import { ActionContainer } from 'components/Container'

const Staking = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    
    const [stakingData, setStakingData] = useState<StakingData>();
    const [estimateCRatio, setEstimateCRatio] = useState<string>('0');
    const [stakingAmount, setStakingAmount] = useState<{PERI?: string, USDC?: string}>({
        PERI: '0',
        USDC: '0'
    });

    const [maxStakingAmount , setMaxStakingAmount] = useState<{USDC?: string, PERI?: string}>({
        USDC: '0',
        PERI: '0'
    });

    const [mintingAmount, setMintingAmount] = useState<{pUSD: string}>({
        pUSD: '0'
    });
    
    const [maxMintingAmount, setMaxMintingAmount] = useState<{pUSD?: string}>({
        pUSD: '0'
    });

    const [needApprove, setNeedApprove] = useState<boolean>(false);
    const dataIntervalTime = 1000 * 60 * 3;

    const { js: { PeriFinance } }  = pynthetix as any;

    const getIssuanceData = useCallback(async () => {
        dispatch(setIsLoading(true));
        try {
            const data = await getStakingData(currentWallet);
            setStakingData(data);
            setMaxMintingAmount({
                pUSD: data.issuable['all'],
            });
        } catch(e) {
            console.log(e);
        }

        dispatch(setIsLoading(false));
        // eslint-disable-next-line
    }, [currentWallet])

    useEffect(() => {
        const init = async() => {
            return await getIssuanceData(); 
        }
        
        const interval = setInterval( async () => await init(), dataIntervalTime);
        init();
        
        return () => {
            clearInterval(interval);
        }
        // eslint-disable-next-line
    } ,[currentWallet]);
    
    const setMintAmount = useCallback ((value, isMax = false) => {
        value = value.replace(/,/g, '');

        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,18}/g)[0];
        }
        
        if(isNaN(Number(value)) || value === "") {
            setMintingAmount({pUSD: ''});
            setStakingAmount( { PERI: '0', USDC: '0'} );
            setMaxStakingAmount({USDC: '0'});
            setEstimateCRatio(getStakingEstimateCRatio(
                { 
                    PERITotalBalance: stakingData.balances['PERITotal'], 
                    debtBalanceOf: stakingData.balances['debt'],
                    exchangeRates: stakingData.exchangeRates,
                    mintingAmount: 0,
                    stakingAmount: { PERI: '0', USDC: '0'},
                    stakedAmount: stakingData.stakedAmount['USDC']
                }
            ));

            return false;
        }

        if(utils.parseEther(maxMintingAmount['pUSD']).lt(utils.parseEther(value))) {
            value = (maxMintingAmount['pUSD']);
        }

        const maxpUSDStakingAmount = getStakingMaxUSDCAmount({
            mintingAmount: value,
            stakeableUSDC: stakingData.stakeable.USDC,
            issuanceRatio: stakingData.issuanceRatio,
            exchangeRates: stakingData.exchangeRates,
            balances: stakingData.balances
        });

        setMaxStakingAmount({USDC: maxpUSDStakingAmount});
        
        const {USDC, PERI} = getStakingAmount({
            issuanceRatio: stakingData.issuanceRatio,
            exchangeRates: stakingData.exchangeRates,
            mintingAmount: value,
            stakingAmount,
        });
        
        
        setStakingAmount({USDC, PERI});
        setEstimateCRatio(getStakingEstimateCRatio(
            { 
                PERITotalBalance: stakingData.balances['PERITotal'], 
                debtBalanceOf: stakingData.balances['debt'],
                exchangeRates: stakingData.exchangeRates,
                mintingAmount: value,
                stakingAmount: {USDC, PERI},
                stakedAmount: stakingData.stakedAmount['USDC']
            }
        ));
        
        setMintingAmount({pUSD: isMax ? value : value});
        // getGasEstimate();
    }, [stakingData, maxMintingAmount, stakingAmount])

    const setAmountMax = () => {
        setMintAmount(maxMintingAmount['pUSD'], true);
    }

    const setUSDCAmount = useCallback( (value, isMax = false) => {
        value = value.replace(/,/g, '');
        
        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,18}/g)[0];
        }

        if(isNaN(Number(value)) || value === "") {
            setStakingAmount({
                USDC: '', PERI: stakingAmount['PERI']}
            )
            setEstimateCRatio(getStakingEstimateCRatio(
                { 
                    PERITotalBalance: stakingData.balances['PERITotal'], 
                    debtBalanceOf: stakingData.balances['debt'],
                    exchangeRates: stakingData.exchangeRates,
                    mintingAmount: mintingAmount['pUSD'],
                    stakingAmount,
                    stakedAmount: stakingData.stakedAmount['USDC']
                }
            ));
            return false;
        }
    
        //allowance check()
        if(numbro(stakingData.allowance['USDC']).subtract(numbro(value).value()).value() < 0) {
            setNeedApprove(true)
        }
        
    
        if(numbro(maxStakingAmount['USDC']).clone().subtract(numbro(value).value()).value() < 0 ) {
            value = (maxStakingAmount['USDC']);
        }

        const stakingAmounts = getStakingAmount({
            issuanceRatio: stakingData.issuanceRatio,
            exchangeRates: stakingData.exchangeRates,
            mintingAmount: mintingAmount['pUSD'],
            stakingAmount: {USDC: value, PERI: stakingAmount['PERI']},
        })
        setStakingAmount(
            {USDC: value,
            PERI: stakingAmounts.PERI}
        );

        setEstimateCRatio(getStakingEstimateCRatio(
            { 
                PERITotalBalance: stakingData.balances['PERITotal'], 
                debtBalanceOf: stakingData.balances['debt'],
                exchangeRates: stakingData.exchangeRates,
                mintingAmount: mintingAmount['pUSD'],
                stakingAmount: {USDC: value, PERI: stakingAmount['PERI']},
                stakedAmount: stakingData.stakedAmount['USDC']
            }
        ));
    }, [stakingData, maxStakingAmount, stakingAmount, mintingAmount])

    const setUSDCAmountMax = () => {
        setUSDCAmount(maxStakingAmount['USDC'], true);
    } 

    const getGasEstimate = async () => {
        let estimateGasLimit;
        try {
            estimateGasLimit = await PeriFinance.contract.estimate.issuePynthsAndStakeUSDC(
                utils.parseEther(mintingAmount['pUSD']).toString(),
                utils.parseEther(stakingAmount['USDC']).toString(),
            );

        } catch(e) {
            estimateGasLimit = 600000;
        }
        return numbro(estimateGasLimit).multiply(1.2).value();
    }

    const onSaking = async () => {
        dispatch(setIsLoading(true));
        
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit: await getGasEstimate(),
        }
        
        try {
            
            let transaction;
            
            transaction = await PeriFinance.issuePynthsAndStakeUSDC(              
                utils.parseEther(mintingAmount['pUSD']).toString(),
                utils.parseEther(stakingAmount['USDC']).toString(),
                transactionSettings
            );

            history.push('/')
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `Staked & Minted ${mintingAmount['pUSD']} pUSD ${stakingAmount['USDC']} USDC`,
                    type: 'Staked & Minted'
                }
            ));
        } catch(e) {
            console.log(e);
        }    
        dispatch(setIsLoading(false));
    }

    const approve = async () => {
        dispatch(setIsLoading(true));
        try {
            await USDC.approve();
            setNeedApprove(false);
            
        } catch (e) {

        }
        dispatch(setIsLoading(false));
        getIssuanceData();
    }
    return (
            <ActionContainer>
                <div>
                    <StakingInfoContainer>
                        <H5>Estimated C-Ratio: {estimateCRatio}%</H5>
                    </StakingInfoContainer>
                    
                    <Input key="pUSD"
                        currencyName="pUSD"
                        value={mintingAmount['pUSD'].toString()}
                        onChange={(event) => setMintAmount(event.target.value)}
                        onBlur={() => setMintingAmount({pUSD: mintingAmount['pUSD']})}
                        maxAction={() => setAmountMax()}
                        maxAmount={maxMintingAmount['pUSD']}
                        
                    />
                    <Input key="USDC"
                        currencyName="USDC"
                        value={stakingAmount['USDC'].toString()}
                        onChange={(event) => setUSDCAmount(event.target.value)}
                        onBlur={() => setStakingAmount({USDC: stakingAmount['USDC'], PERI: stakingAmount['PERI']})}
                        maxAction={() => setUSDCAmountMax()}
                        maxAmount={maxStakingAmount['USDC']}
                        
                    />
                    <Input key="PERI"
                        currencyName="PERI"
                        disabled= {true}
                        value={(stakingAmount['PERI'])}
                    />
                </div>
                <div>
                    {
                        needApprove ? 
                        (<StakingButton onClick={ () => approve()}><H4 weigth="bold">Approve</H4></StakingButton>)
                        : (<StakingButton onClick={ () => onSaking()} disabled={numbro(estimateCRatio).value() < 400 }>
                            <H4 weigth="bold">
                                { numbro(estimateCRatio).value() < 400 ? 'Maintain the C-Ratio above 400%' : 'STAKE & MINT'}
                                
                            </H4>
                        </StakingButton>)
                    }
                    <Fee gasPrice={seletedFee.price}/>
                </div>
            </ActionContainer>
    );
}

const StakingInfoContainer = styled.div`
    padding: 0 10px;
    H5 {
       text-align: right;
    }
`

const StakingButton = styled(BlueGreenButton)`
    width: 100%;
    height: 50px;
`
export default Staking;