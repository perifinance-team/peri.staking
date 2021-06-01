import { useTranslation } from 'react-i18next';
import { H5, H6 } from 'components/Text'

import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route,
    useHistory
} from "react-router-dom";

import Action from 'screens/Action'
import { ActionContainer } from 'components/Container'
import StakingToPERI from './StakingToPERI'
import StakingToPERIandUSDC from './StakingToPERIandUSDC'
import StakingToUSDC from './StakingToUSDC'

import * as S from './styles'

const Staking = () => {
    const { t } = useTranslation();
    const history = useHistory();

    return (
        <Action title="STAKING"
            subTitles={[
                "Mint pUSD by staking your PERI.",
                "This gives you a Collateralization Ratio and a debt, allowing you to earn staking rewards."
            ]}
        >
            
            <Switch>
                <Route exact path="/staking">
                    <ActionContainer>
                        <S.ActionButtonRow>
                            <S.ActionButtonContainer onClick={() => history.push(`/staking/PERI`)}>
                                <S.ActionImage src={`/images/dark/actions/staking.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                    <H5 weigth={'bold'}>Staking</H5>
                                    <H6 weigth={'bold'}>only PERI</H6>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>
                            
                            <S.ActionButtonContainer onClick={() => history.push(`/staking/USDC`)}>
                                <S.ActionImage src={`/images/dark/actions/staking.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                <H5 weigth={'bold'}>Staking</H5>
                                <H6 weigth={'bold'}>only USDC</H6>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>

                            <S.ActionButtonContainer onClick={() => history.push(`/staking/PERIandUSDC`)}>
                                <S.ActionImage src={`/images/dark/actions/staking.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                    <H5 weigth={'bold'}>Staking </H5>
                                    <H6 weigth={'bold'}>PERI and USDC</H6>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>
                        </S.ActionButtonRow>
                    </ActionContainer>        
                </Route>

                <Route exact path="/staking/PERI"> 
                    <StakingToPERI/>
                </Route>

                <Route exact path="/staking/PERIandUSDC"> 
                    <StakingToPERIandUSDC/>
                </Route>

                <Route exact path="/staking/USDC"> 
                    <StakingToUSDC/>
                </Route>

            </Switch>
        </Action>
    );
}



export default Staking;