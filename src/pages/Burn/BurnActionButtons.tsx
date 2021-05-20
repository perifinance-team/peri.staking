import { useEffect, useState, useCallback} from 'react';
import styled from 'styled-components'
import { useSelector, useDispatch} from "react-redux";
import { utils } from 'ethers'
import { addSeconds, differenceInSeconds } from 'date-fns';
import { NotificationManager } from 'react-notifications';
import { useHistory } from 'react-router-dom'

import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'
import { updateTransaction } from 'config/reducers/transaction'
import { pynthetix, getCurrencyFormat } from 'lib'

import { BlueGreenButton } from 'components/Button'
import { H4, H5 } from 'components/Text'
import numbro from 'numbro'

function str_pad_left(string, pad, length) {
	return (new Array(length + 1).join(pad) + string).slice(-length);
}

export const secondsToTime = seconds => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds - hours * 3600) / 60);
	if (hours > 0) {
		return `${hours}h ${str_pad_left(minutes, '0', 2)}m`;
	} else if (minutes > 0) {
		return `${str_pad_left(minutes, '0', 2)} mins`;
	}
	return `up to 1 minute`;
};

const BurnActionButtons = ({burnData, burningAmount, gasPrice}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const [issuanceDelay, setIssuanceDelay] = useState<number>(0)
    const [gasLimit, setGasLimit] = useState<number>(0);

    const { js: { Issuer, PeriFinance} } = pynthetix;

    const getGasEstimate = async () => {
        let estimateGasLimit;
        try {
            estimateGasLimit = await PeriFinance.contract.estimate.burnPynths(
                utils.parseEther(numbro(burningAmount['pUSD']).value().toString())
            );
        } catch (e) {
            estimateGasLimit = 32000;
            console.log(e);
        }
        setGasLimit(numbro(estimateGasLimit).multiply(1.2).value());
    }

    const getIssuanceDelayCheck = useCallback(async() => {
        const canBurnSynths = await Issuer.canBurnPynths(currentWallet);
        const lastIssueEvent = await Issuer.lastIssueEvent(currentWallet);
        const minimumStakeTime = await Issuer.minimumStakeTime();

        if (Number(lastIssueEvent) && Number(minimumStakeTime)) {
            const burnUnlockDate = addSeconds(Number(lastIssueEvent) * 1000, Number(minimumStakeTime));
            const issuanceDelayInSeconds = differenceInSeconds(burnUnlockDate, new Date());
            setIssuanceDelay(
                issuanceDelayInSeconds > 0 ? issuanceDelayInSeconds : canBurnSynths ? 0 : 1
            );
        }
    },[]);
    
    const onBurn = async ({target = false}) => {
        let transaction;
        dispatch(setIsLoading(true));
        await getGasEstimate();
        try {
            if(await Issuer.canBurnPynths(currentWallet)) {
                
                if(target) {
                    const burnToTargetGasLimit = await PeriFinance.contract.estimate.burnPynthsToTarget();
                    transaction = await PeriFinance.burnPynthsToTarget({
                        gasLimit: numbro(burnToTargetGasLimit).multiply(1.2).value(),
                        gasPrice,
                    });
                } else {
                    transaction = await PeriFinance.burnPynths(utils.parseEther(numbro(burningAmount['pUSD']).value().toString()), {
                        gasPrice,
                        gasLimit,
                    });
                }
                history.push('/');

                dispatch(updateTransaction(
                    {
                        hash: transaction.hash,
                        message: `Burnt ${getCurrencyFormat( target ? numbro(burnData.PERIDebtpUSD).subtract(burnData.PERIBalance).value() : burningAmount['pUSD'])} pUSD`,
                        type: 'Burn'
                    }
                ));
                
                
            } else {
                NotificationManager.error('Waiting period to burn is still ongoing');
            }
        } catch (e) {
            console.log(e);
        }
        
        dispatch(setIsLoading(false));
    };

    useEffect(  () => {
        const init = async () => {
            await getIssuanceDelayCheck();
            if(issuanceDelay > 0) {
                NotificationManager.warning(
                    `There is a waiting period after minting before you can burn. Please wait
                    ${secondsToTime(issuanceDelay)} before attempting to burn pUSD.`, 'NOTE', 0
                )
            }
        }

        init();
        
        return () => {
            for(let a = 0; a < NotificationManager.listNotify.length; a++)  {
                NotificationManager.remove(NotificationManager.listNotify[0]);
            }
        }
    }, [])

    if (issuanceDelay) {
        return (
            <BurnButton
                onClick={() => {
                    getIssuanceDelayCheck();
                }}
            >
                <H4 weigth="bold">Retry</H4>
            </BurnButton>
        );
    } else {
        return (
        <>
            <BurnButton
                // disabled={isFetchingGasLimit || gasEstimateError || pUSDBalance === 0}
                onClick={ () => onBurn({target: false})}
            >
                <H4 weigth="bold">BURN</H4>
            </BurnButton>
            {/* <BurnButton
                // disabled={isFetchingGasLimit || gasEstimateError || pUSDBalance === 0}
                onClick={ () => onBurn({target: true})}
            >
                <H4 weigth="bold" color="red">Fix your Collateralization Ratio </H4>
            </BurnButton> */}
        </>)
    }
}

const BurnButton = styled(BlueGreenButton)`
    width: 100%;
    margin-top: 10px;
    height: 50px;
`


export default BurnActionButtons