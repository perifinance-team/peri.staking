import { useEffect, useState, useCallback} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { NotificationManager } from 'react-notifications';
import styled from 'styled-components'

import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'
import { updateTransaction } from 'config/reducers/transaction'

import { StakingData, getStakingData, pynthetix, getStakingEstimateCRatio, getStakingAmount } from 'lib'
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

    const [mintingAmount, setMintingAmount] = useState<{pUSD: string}>({
        pUSD: '0'
    });
    
    const [maxMintingAmount, setMaxMintingAmount] = useState<{pUSD?: string}>({
        pUSD: '0'
    });
    
    const dataIntervalTime = 1000 * 60 * 3;

    const { js: { PeriFinance } }  = pynthetix as any;
    

    const getIssuanceData = useCallback(async () => {
        dispatch(setIsLoading(true));
        try {
            const data = await getStakingData(currentWallet);
            
            // .div(exchangeRates['USDC'].toString()));
            setStakingData(data);
            setMaxMintingAmount({
                pUSD: data.issuable['pUSD'],
            });

            setEstimateCRatio(getStakingEstimateCRatio(
                { 
                    PERITotalBalance: data.balances['PERITotal'], 
                    debtBalanceOf: data.balances['debt'],
                    exchangeRates: data.exchangeRates,
                    mintingAmount: '0',
                    stakingAmount,
                    stakedAmount: data.stakedAmount['USDC']
                }
            ));
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

    const getGasEstimate = async () => {
        let estimateGasLimit;
        try {
            estimateGasLimit = await PeriFinance.contract.estimate.issuePynthsAndStakeUSDC(
                utils.parseEther(numbro(mintingAmount['pUSD']).value().toString()),
                numbro(stakingAmount['USDC']).multiply(10**18).value().toString()
            );
        } catch(e) {
            estimateGasLimit = 600000;
        }
        return numbro(estimateGasLimit).multiply(1.2).value();
    }
    const amountCheck = () => {
        const USDCtopUSD = numbro(stakingAmount['USDC']).divide(numbro(stakingData.exchangeRates['USDC']).value())
        const PERItopUSD = numbro(stakingAmount['PERI']).divide(numbro(stakingData.exchangeRates['PERI']).value())
        
        if(USDCtopUSD.add(PERItopUSD.value()).divide(numbro(stakingData.issuanceRatio).value()).subtract(numbro(mintingAmount['pUSD']).value()).value() === 0) {
            return true;
        } else {
            return false;
        }
    }

    const onSaking = async () => {
        dispatch(setIsLoading(true));
        
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit: await getGasEstimate(),
        }
        
        if(amountCheck()) {
            NotificationManager.error(`please check pUSD amount`, 'success');
            return false;
        }
        
        try {
            let transaction;
            transaction = await PeriFinance.issuePynthsAndStakeUSDC(              
                utils.parseEther(mintingAmount['pUSD']),
                utils.parseEther('0'),
                transactionSettings
            );

            history.push('/')
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `Staked & Minted ${mintingAmount['pUSD']} pUSD`,
                    type: 'Staked & Minted'
                }
            ));
        } catch(e) {
            console.log(e);
        }    
        dispatch(setIsLoading(false));
    }

    return (
            <ActionContainer>
                 <div>
                    <StakingInfoContainer>
                        <H5>Estimated C-Ratio: {(estimateCRatio)}%</H5>
                    </StakingInfoContainer>
                
                    <Input key="pUSD"
                        currencyName="pUSD"
                        value={mintingAmount['pUSD']}
                        onChange={(event) => setMintAmount(event.target.value)}
                        onBlur={() => setMintingAmount({pUSD: mintingAmount['pUSD']})}
                        maxAction={() => setAmountMax()}
                        maxAmount={maxMintingAmount['pUSD']}
                        
                    />
                    <Input key="PERI"
                        currencyName="PERI"
                        disabled= {true}
                        value={numbro(stakingAmount['PERI']).format({mantissa: 6})}
                    />
                </div>
                <div>
                    <StakingButton onClick={ () => onSaking()} disabled={numbro(estimateCRatio).value() < 400 }>
                        <H4 weigth="bold">
                            { numbro(estimateCRatio).value() < 400 ? 'Maintain the C-Ratio above 400%' : 'STAKE & MINT'}
                        </H4>
                    </StakingButton>
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