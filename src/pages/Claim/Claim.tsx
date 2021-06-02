import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { addSeconds, formatDistanceToNow } from 'date-fns';


import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'

import { pynthetix, getCurrencyFormat } from 'lib'

import { updateTransaction } from 'config/reducers/transaction'
import { NotificationManager } from 'react-notifications';

import Action from 'screens/Action'
import { ActionContainer } from 'components/Container'
import { BlueGreenButton } from 'components/Button'
import { H4, H5 } from 'components/Text'
import Fee from 'components/Fee'
import Input from 'components/Input'
import numbro from 'numbro'
import {utils} from 'ethers'
import { gasPrice } from 'helpers/gasPrice'

type ClaimData = {
    closeIn: string,
    duration: string,
    periods: string,
    rewards: {
        exchage: string,
        staking: string,
    }
    claimable: boolean,
    isCloseFeePeriodEnabled: boolean
}

const Claim = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const [ claimData, setClaimData ] = useState<ClaimData>({
        closeIn: '',
        duration: '0',
        periods: '0',
        rewards: {
            exchage: '0',
            staking: '0'
        },
        claimable: false,
        isCloseFeePeriodEnabled: false
    });
    
    const { js: { FeePool } }  = pynthetix as any;
    
    const getFeePeriodCountdown = (recentFeePeriods, feePeriodDuration) => {
        console.log(recentFeePeriods)
        const currentPeriodStart =
            recentFeePeriods && recentFeePeriods.startTime
                ? new Date(parseInt(recentFeePeriods.startTime) * 1000)
                : null;
        const currentPeriodEnd =
            currentPeriodStart && feePeriodDuration
                ? addSeconds(currentPeriodStart, feePeriodDuration)
                : null;
        return {
            closeIn: formatDistanceToNow(currentPeriodEnd),
            isCloseFeePeriodEnabled: Math.ceil(Date.now() / 1000) > (Number(recentFeePeriods.startTime) + Number(feePeriodDuration))
        }
        
    };

    const init = async () => {
        dispatch(setIsLoading(true));
        
        try {
            const duration = await FeePool.feePeriodDuration();
            const periods = await FeePool.recentFeePeriods(0);
            const claimable = await FeePool.isFeesClaimable(currentWallet);
            const reward = await FeePool.feesAvailable(currentWallet);
            //reward type  array[0] = exchage | array[1] = staking
            
            const { closeIn, isCloseFeePeriodEnabled } = getFeePeriodCountdown(periods, duration);
    
            setClaimData({
                closeIn,
                duration,
                periods,
                rewards: {
                    exchage: utils.formatEther(reward[0]),
                    staking: utils.formatEther(reward[1]),
                },
                claimable,
                isCloseFeePeriodEnabled
            });
        } catch(e) {
            console.log(e);
            
        }
        dispatch(setIsLoading(false));
    }

    useEffect(() => {
        init();
        // eslint-disable-next-line
    },[currentWallet])

    const getGasEstimate = async (type) => {
        let estimateGasLimit;
        try {
            estimateGasLimit = await FeePool.contract.estimate[type]();
        } catch (e) {
            estimateGasLimit = 600000;
            console.log(e);
        }
        return numbro(estimateGasLimit).multiply(1.2).value();
    }

    const onClaim = async () => {
        dispatch(setIsLoading(true));
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit: getGasEstimate('claimFees'),
        }
		try {
            const transaction = await FeePool.claimFees(transactionSettings);
            history.push('/')
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `Claimed rewards`,
                    type: 'CLAIM'
                }
            ));
            
        } catch(e) {
            console.log(e);
        }
        dispatch(setIsLoading(false));
    }

    const onCloseFeePeriod = async () => {
		try {
			const transaction = await FeePool.closeCurrentFeePeriod({
				gasPrice: gasPrice(seletedFee.price),
				gasLimit: getGasEstimate('closeCurrentFeePeriod'),
			});
            history.push('/');
			dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `Close CurrentFeePeriod`,
                    type: 'Close CurrentFeePeriod'
                }
            ));
		} catch (e) {
			console.log(e);
		}
	};

    useEffect(() => {
        NotificationManager.warning(
            'if not collected within 7 days, your rewards will be forfeited and rolled over into the fee pool.', 'NOTE', 0
        )
        return () => NotificationManager.remove(NotificationManager.listNotify[0]);
    },[])
    
    return (
        <Action title="CLAIM"
            subTitles={[
                "If you have staked your PERI and minted pUSD, you are eligible to collect two kinds of rewards :",
                "PERI staking rewards"
                // , and Pynths exchange rewards generated on Kwenta.io.
            ]}
        >
                <ActionContainer>
                    <ClaimInfoContainer>
                        <Info>
                            <H5>Time Left to Claim : </H5><H5 weigth={'bold'} color={'primary'}>{claimData.closeIn}</H5>
                        </Info>
                        <Info>
                            <H5>Your fee claim status : </H5><H5 weigth={'bold'} color={
                                claimData.claimable ? 'primary' : 'red'
                            }> {claimData.claimable ? 'OPEN' : 'BLOCKED'}</H5>
                        </Info>
                    </ClaimInfoContainer>
                    <div>
                        <Input key="primary"
                            currencyName="pUSD"
                            value={`exchage rewards  : ${getCurrencyFormat(claimData.rewards.exchage)}`}
                            disabled={true}
                        />
                        <Input key="secondary"
                            currencyName="PERI"
                            value={`staking rewards  : ${getCurrencyFormat(claimData.rewards.staking)}`}
                            disabled={true}
                        />
                    </div>

                    <div>
                        {claimData.isCloseFeePeriodEnabled ? (
                            <ClaimButton onClick={ () => onCloseFeePeriod()}><H4 weigth="bold">CLOSE CURRENT PERIOD</H4></ClaimButton>
                        ) : null}
                        
                        {claimData.claimable ? 
                            <ClaimButton onClick={ () => onClaim()}><H4 weigth="bold">CLAIM</H4></ClaimButton>:
                            <ClaimButton onClick={ () => init()}><H4 weigth="bold">RETRY</H4></ClaimButton>    
                        }
                        <Fee gasPrice={seletedFee.price}/>
                    </div>
                </ActionContainer>
                
        </Action>
    );
}

const ClaimInfoContainer = styled.div`
    padding: 5px 0px;
    display: flex;
    justify-content: space-between;
`
const Info = styled.div`
    display: flex;
    vertical-align: middle;
    text-align: center;
    h5 {
        margin: 0px 5px;
    }
`

const ClaimButton = styled(BlueGreenButton)`
    width: 100%;
    margin-top: 10px;
    height: 50px;
`

export default Claim;