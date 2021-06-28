import styled from 'styled-components'
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { NotificationManager } from 'react-notifications';

import {
    useHistory
} from "react-router-dom";
import { pynthetix, LPContract, calculator } from 'lib'
import { utils } from 'ethers'
import { gasPrice } from 'helpers/gasPrice'
import { updateTransaction } from 'config/reducers/transaction'

import Fee from 'components/Fee'
import Input from 'components/Input'
import { H4 } from 'components/Text'
import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'
import { ActionContainer } from 'components/Container'
import { BlueGreenButton } from 'components/Button'

const LPStaking = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const [ maxStakingAmount, setMaxStakingAmount ] = useState<utils.BigNumber>(utils.bigNumberify('0'));
    const [ allowanceAmount, setAllowanceAmount ] = useState<utils.BigNumber>(utils.bigNumberify('0'));
    const [ stakingAmount,  setStakingAmount ] = useState<string>('');
    
    const [ needApprove, setNeedApprove ] = useState<boolean>(false);

    const getLPData = useCallback( async () => {
        dispatch(setIsLoading(true));
        const LPBalance = await LPContract.balanceOf(currentWallet);
        const allowance = await LPContract.allowance(currentWallet);
        
        setMaxStakingAmount(LPBalance);
        setAllowanceAmount(allowance);
        dispatch(setIsLoading(false));
    }, [LPContract]);

    useEffect( () => {
        getLPData();
        
    }, [currentWallet])

    const approve = async () => {
        dispatch(setIsLoading(true));
        try {
            const transaction = await LPContract.approve();
            NotificationManager.info('try Approve', 'in progress', 0);
            
            const getState = async () => {
                const state = await pynthetix.provider.getTransactionReceipt(transaction.hash);
                if(state) {
                    if(state.status === 1) {
                        NotificationManager.remove(NotificationManager.listNotify[0]);
                        NotificationManager.success('success', 'approve')
                        setNeedApprove(false)
                    }
                } else {
                    setTimeout(() => getState(), 1000);
                }
            }
            getState();
        } catch (e) {
            console.log(e);
        }
        dispatch(setIsLoading(false));
    }

    const inputStakingAmount = (amount) => {
        amount = amount.trim().replace(/,/g, '');
        
        if((/\./g).test(amount)) {
            amount = amount.match(/\d+\.\d{0,18}/g)[0];
        }

        if(isNaN(Number(amount)) || amount === "") {
            setStakingAmount('');
            return false;
        }

        if(allowanceAmount.lt(utils.parseEther(amount))) {
            setNeedApprove(true)
        }
    
        if(maxStakingAmount.lt(utils.parseEther(amount))) {
            setStakingAmount(utils.formatEther(maxStakingAmount));
            return false;
        }

        setStakingAmount(amount);
    }

    const setAmountMax = () => {
        inputStakingAmount(utils.formatEther(maxStakingAmount));
    }

    const getGasEstimate = async () => {
        let estimateGasLimit;
        console.log(LPContract.contract.estimate)
        try {
            estimateGasLimit = await LPContract.contract.estimate.stake(
                utils.parseEther(stakingAmount)
            );
            
        } catch(e) {
            console.log(e);
            estimateGasLimit = 600000;
        }
        return calculator(calculator(utils.bigNumberify(estimateGasLimit), utils.bigNumberify('12'), 'mul'), utils.bigNumberify('10'), 'div');
    }

    const onStaking = async () => {
        
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit: await getGasEstimate(),
        }

        try {
            let transaction;
            dispatch(setIsLoading(true));
            transaction = await LPContract.stake(utils.parseEther(stakingAmount), transactionSettings);

            history.push('/')
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `Stake ${stakingAmount} LP TOKEN`,
                    type: 'Stake LP'
                }
            ));
        } catch(e) {
            console.log(e);
        }    
        dispatch(setIsLoading(false));
        getLPData();
    }

    

    return (
        <ActionContainer>
            <div>
                <Input key="PERI/ETH LP"
                    value={stakingAmount}
                    currencyName="PERI_ETH"
                    onChange={ e => inputStakingAmount(e.target.value)}
                    isLp={true}
                    maxAction={() => setAmountMax()}
                    maxAmount={utils.formatEther(maxStakingAmount)}
                />
                {
                needApprove ? 
                (<StakingButton onClick={ () => approve()}><H4 weigth="bold">Approve</H4></StakingButton>) :
                (<StakingButton onClick={ () => onStaking()}>
                    <H4 weigth="bold"> STAKE </H4>
                </StakingButton>)
                }
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

export default LPStaking;