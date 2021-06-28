
import {
    HashRouter as Router,
    Switch,
    Route,
    NavLink,
    useHistory
} from "react-router-dom";

import { useTranslation } from 'react-i18next';

import Action from 'screens/Action'
import { H5, H6 } from 'components/Text'

import LPStaking from './LPStaking'
import LPUnstaking from './LPUnstaking'
import LPReward from './LPReward'

import * as S from './styles'
import { ActionContainer } from 'components/Container'

const LP = () => {
    
    const { t } = useTranslation();
    const history = useHistory();
    const actions = [
        'staking',
        'unstaking',
        'reward',
    ]
    
    

    return (
        <Action title="LP STAKING"
            subTitles={[
                "Mint pUSD by staking your PERI.",
                "This gives you a Collateralization Ratio and a debt, allowing you to earn staking rewards."
            ]}
        >
            <Switch>
                <Router basename="/lp">
                    <Switch>
                        <Route exact path="/">
                            <ActionContainer>
                                <S.ActionButtonRow>
                                    {actions.map((action) => 
                                        (
                                            <S.ActionButtonContainer onClick={() => history.push(`/lp/${action}`)} key={action}>
                                                <S.ActionImage src={`/images/dark/actions/${action}.svg`}></S.ActionImage>
                                                <S.ActionButtonTitle>
                                                    <H5 weigth={'bold'}>{action.toLocaleUpperCase()}</H5>
                                                    <H6 weigth={'bold'}>{t(`lp.${action}.subTitle`)}</H6>
                                                </S.ActionButtonTitle>
                                            </S.ActionButtonContainer>
                                        )
                                    )}
                                </S.ActionButtonRow>
                            </ActionContainer>
                        </Route>
                        <Route exact path="/staking">
                            <LPStaking></LPStaking>
                        </Route>
                        <Route exact path="/unstaking">
                            <LPUnstaking></LPUnstaking>
                        </Route>
                        <Route exact path="/reward">
                            <LPReward></LPReward>
                        </Route>
                    </Switch>
                </Router>
            </Switch>
        </Action>
    );
}

export default LP;