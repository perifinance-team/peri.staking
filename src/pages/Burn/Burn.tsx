import { useSelector, useDispatch } from "react-redux";
import { RootState } from 'config/reducers'
import { updateTransaction } from 'config/reducers/transaction'
import { useTranslation } from 'react-i18next';
import { gasPrice } from 'helpers/gasPrice';
import { setIsLoading } from 'config/reducers/app'
import { NotificationManager } from 'react-notifications';

import { pynthetix } from 'lib'
import numbro from 'numbro'
import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route,
    useHistory
} from "react-router-dom";

import { H5 } from 'components/Text'
import Action from 'screens/Action'
import { ActionContainer } from 'components/Container'
import BurnToPERI from './BurnToPERI'
import BurnToPERIandUSDC from './BurnToPERIandUSDC'
import BurnToUSDC from './BurnToUSDC'


import * as S from './styles'

const Burn = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    const { currentWallet } = useSelector((state: RootState) => state.wallet);

    const burnToTarget = async () => {
        const { js: {Issuer, PeriFinance} } = pynthetix;
        dispatch(setIsLoading(true));
        let transaction;
        const getGasEstimate = async () => {
            let estimateGasLimit;
            try {
                estimateGasLimit = await PeriFinance.contract.estimate.burnPynthsToTargetAndUnstakeUSDCToTarget();
            } catch (e) {
                estimateGasLimit = 350000;
                console.log(e);
            }
            return numbro(estimateGasLimit).multiply(1.2).value();
        }

        const transactionInfo = {
            gasPrice: gasPrice(seletedFee.price),
            gasLimit: await getGasEstimate()
        }
        try {
            if(await Issuer.canBurnPynths(currentWallet)) {
                
                transaction = await PeriFinance.burnPynthsToTargetAndUnstakeUSDCToTarget(
                    transactionInfo
                );
                
                history.push('/');

                dispatch(updateTransaction(
                    {
                        hash: transaction.hash,
                        message: `Burnt to target C-Ratio 400%`,
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

        
    }
    return (
        <Action title="BURN"
            subTitles={[
                "If you have staked your PERI and minted pUSD, you are eligible to collect two kinds of rewards :",
                "allowing you to transfer your non-escrowed PERI."
            ]}
        >
            
            <Switch>
                <Route exact path="/burn">
                    <ActionContainer>
                        <S.ActionButtonRow>
                            <S.ActionButtonContainer onClick={() => history.push(`/burn/PERI`)}>
                                <S.ActionImage src={`/images/dark/actions/burn.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                    <H5 weigth={'bold'}>Burn PERI</H5>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>
                            
                            <S.ActionButtonContainer onClick={() => history.push(`/burn/USDC`)}>
                                <S.ActionImage src={`/images/dark/actions/burn.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                <H5 weigth={'bold'}>Burn USDC</H5>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>

                            <S.ActionButtonContainer onClick={() => history.push(`/burn/PERIandUSDC`)}>
                                <S.ActionImage src={`/images/dark/actions/burn.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                    <H5 weigth={'bold'}>Burn </H5>
                                    <H5 weigth={'bold'}>PERI and USDC </H5>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>

                            <S.ActionButtonContainer onClick={() => burnToTarget()}>
                                <S.ActionImage src={`/images/dark/actions/burn.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                    <H5 weigth={'bold'}>Burn </H5>
                                    <H5 weigth={'bold'}>Target 400% </H5>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>

                        </S.ActionButtonRow>
                    </ActionContainer>        
                </Route>

                <Route exact path="/burn/PERI"> 
                    <BurnToPERI/>
                </Route>

                <Route exact path="/burn/PERIandUSDC"> 
                    <BurnToPERIandUSDC/>
                </Route>

                <Route exact path="/burn/USDC"> 
                    <BurnToUSDC/>
                </Route>

            </Switch>
        </Action>
    );
}



export default Burn;