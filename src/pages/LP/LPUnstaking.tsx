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

const LPUnstaking = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const [ maxUnstakedAmount, setMaxUnstakedAmount ] = useState<utils.BigNumber>(utils.bigNumberify('0'));
    const [ unstakingAmount,  setUnstakingAmount ] = useState<string>('');

    const getLPData = useCallback( async () => {
        dispatch(setIsLoading(true));
        const LPStakedAmount = await LPContract.getStakingAmount(currentWallet);
        setMaxUnstakedAmount(LPStakedAmount);
        dispatch(setIsLoading(false));
    }, [LPContract]);

    useEffect( () => {
        getLPData();
        
    }, [currentWallet])

    const inputUnstakingAmount = (amount) => {
        amount = amount.trim().replace(/,/g, '');
        
        if((/\./g).test(amount)) {
            amount = amount.match(/\d+\.\d{0,18}/g)[0];
        }

        if(isNaN(Number(amount)) || amount === "") {
            setUnstakingAmount('');
            return false;
        }
    
        if(maxUnstakedAmount.lt(utils.parseEther(amount))) {
            setUnstakingAmount(utils.formatEther(maxUnstakedAmount));
            return false;
        }

        setUnstakingAmount(amount);
    }

    const setAmountMax = () => {
        inputUnstakingAmount(utils.formatEther(maxUnstakedAmount));
    }

    const getGasEstimate = async () => {
        let estimateGasLimit;
        try {
            estimateGasLimit = await LPContract.contract.estimate.withdraw(
                utils.parseEther(unstakingAmount)
            );
            
        } catch(e) {
            console.log(e);
            estimateGasLimit = 600000;
        }
        return calculator(calculator(utils.bigNumberify(estimateGasLimit), utils.bigNumberify('12'), 'mul'), utils.bigNumberify('10'), 'div');
    }

    const onUnStaking = async () => {
        
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit: await getGasEstimate(),
        }

        try {
            let transaction;
            dispatch(setIsLoading(true));
            transaction = await LPContract.withdraw(utils.parseEther(unstakingAmount), transactionSettings);

            history.push('/')
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `Stake ${unstakingAmount} LP TOKEN`,
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
                <Input key="PERI/ETH LP"
                    value={unstakingAmount}
                    currencyName="PERI_ETH"
                    onChange={ e => inputUnstakingAmount(e.target.value)}
                    isLp={true}
                    maxAction={() => setAmountMax()}
                    maxAmount={utils.formatEther(maxUnstakedAmount)}
                />
                <StakingButton onClick={ () => onUnStaking() }>
                    <H4 weigth="bold"> UNSTAKE </H4>
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

export default LPUnstaking;