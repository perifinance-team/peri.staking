import { useEffect, useState, useCallback} from 'react';
import styled from 'styled-components'
import { useSelector } from "react-redux";
import { utils } from 'ethers'
import { addSeconds, differenceInSeconds } from 'date-fns';
import { NotificationManager } from 'react-notifications';

import { RootState } from 'config/reducers'
import { pynthetix, getCurrencyFormat } from 'lib'

import { BlueGreenButton } from 'components/Button'
import { H4, H5 } from 'components/Text'

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

const BurnActionButtons = ({burningAmount, gasPrice, gasLimit}) => {
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const [issuanceDelay, setIssuanceDelay] = useState<number>(0);
    const [waitingPeriod, setWaitingPeriod] = useState<number>(0);
    const { js: { Issuer, Exchanger, PeriFinance} } = pynthetix;
    const pUSDBytes = utils.formatBytes32String('pUSD');

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

    const getWaitingPeriodCheck = useCallback(async() => {
        const maxSecsLeftInWaitingPeriod = await Exchanger.maxSecsLeftInWaitingPeriod(
            currentWallet,
            pUSDBytes
        );
        setWaitingPeriod(Number(maxSecsLeftInWaitingPeriod));
    },[]);
    
    const onBurn = async () => {
        let transaction;

        try {
            if(true) {
                transaction = await PeriFinance.burnPynthsToTarget({
                    gasLimit,
                    gasPrice,
                });
            } else {
                transaction = await PeriFinance.burnPynths(burningAmount, {
                    gasPrice,
                    gasLimit,
                });
            }
            console.log(transaction)
        } catch (e) {
            
        }
    };

    useEffect(  () => {
        const init = async () => {
            await getIssuanceDelayCheck();
            await getWaitingPeriodCheck();
            if(issuanceDelay > 0) {
                NotificationManager.warning(
                    `There is a waiting period after minting before you can burn. Please wait
                    ${secondsToTime(issuanceDelay)} before attempting to burn pUSD.`, 'NOTE', 0
                )
            }
            if(waitingPeriod > 0) {
                NotificationManager.warning(
                    `There is a waiting period after completing a trade. Please wait
                    ${secondsToTime(waitingPeriod)} before attempting to burn pUSD.`, 'NOTE', 0
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
                    if (waitingPeriod) {
                        getWaitingPeriodCheck();
                    }
                }}
            >
                <H4 weigth="bold">Retry</H4>
            </BurnButton>
        );
    } else if (waitingPeriod) {
        return (
            <BurnButton onClick={() => getWaitingPeriodCheck()}>
                
                <H4 weigth="bold">Retry</H4>
            </BurnButton>
        );
    } else {
        return (
            <BurnButton
                // disabled={isFetchingGasLimit || gasEstimateError || pUSDBalance === 0}
                onClick={ () => onBurn()}
            >
                <H4 weigth="bold">BURN</H4>
            </BurnButton>
        );
    }
}

const BurnButton = styled(BlueGreenButton)`
    width: 100%;
    height: 50px;
`

export default BurnActionButtons