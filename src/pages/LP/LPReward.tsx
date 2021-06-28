import styled from 'styled-components'
import { useEffect, useState, useCallback} from 'react';
import { useSelector, useDispatch } from "react-redux";

import {
    useHistory
} from "react-router-dom";
import { LPContract, calculator } from 'lib'
import { utils } from 'ethers'
import { gasPrice } from 'helpers/gasPrice'
import { updateTransaction } from 'config/reducers/transaction'

import { H4, H5 } from 'components/Text'
import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'
import Fee from 'components/Fee'
import { ActionContainer } from 'components/Container'
import { BlueGreenButton } from 'components/Button'
import Input from 'components/Input'

const LPReward = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const [ stakedAmount, setStakedAmount ] = useState<utils.BigNumber>(utils.bigNumberify('0'));
    const [ LPRewardAmount, setLPRewardAmount ] = useState<utils.BigNumber>(utils.bigNumberify('0'));
    
    const getLPData = useCallback( async () => {
        dispatch(setIsLoading(true));  
        const LPStakingAmount = await LPContract.getStakingAmount(currentWallet);
        const rewardAmount = await LPContract.earned(currentWallet);
        
        setStakedAmount(LPStakingAmount);
        setLPRewardAmount(rewardAmount);
        dispatch(setIsLoading(false));
    }, [LPContract]);

    useEffect( () => {
        getLPData();
        
    }, [currentWallet])

    
    const getGasEstimate = async (type) => {
        let estimateGasLimit;
        try {
            estimateGasLimit = await LPContract.contract.estimate[type]();
            
        } catch(e) {
            console.log(e);
            estimateGasLimit = 600000;
        }
        return calculator(calculator(utils.bigNumberify(estimateGasLimit), utils.bigNumberify('12'), 'mul'), utils.bigNumberify('10'), 'div');
    }

    const onExit = async () => {
        
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit: await getGasEstimate('exit'),
        }

        try {
            let transaction;
            dispatch(setIsLoading(true));
            transaction = await LPContract.exit(transactionSettings);

            history.push('/')
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `LP Staking reward ${LPRewardAmount} LP TOKEN`,
                    type: 'Stake LP'
                }
            ));
        } catch(e) {
            console.log(e);
        }    
        dispatch(setIsLoading(false));
    }

    const onReward = async () => {
        
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit: await getGasEstimate('getReward'),
        }

        try {
            let transaction;
            dispatch(setIsLoading(true));
            transaction = await LPContract.getReward(transactionSettings);

            history.push('/')
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `LP Staking reward ${LPRewardAmount} LP TOKEN`,
                    type: 'Stake LP'
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
                <Input key="PERI/ETH LP"
                    value={`LP Staking amount: ${utils.formatEther(stakedAmount)}`}
                    currencyName="PERI_ETH"
                    isLp={true}
                    disabled={true}
                />

                <Input key="PERI"
                    value={`LP Staking reward: ${utils.formatEther(LPRewardAmount)}`}
                    currencyName="PERI"
                    disabled={true}
                />
                
            </div>
            
            <div>
                <StakingButton onClick={ () => onReward()}>
                    <H4 weigth="bold"> REWARD </H4>
                </StakingButton>

                <StakingButton onClick={ () => onExit()}>
                    <H4 weigth="bold"> EXIT </H4>
                </StakingButton>
            </div>
            <Fee gasPrice={seletedFee.price}/>
        </ActionContainer>
    );
}

const StakingButton = styled(BlueGreenButton)`
    width: 100%;
    margin: 20px 0px;
    height: 50px;
`

export default LPReward;