import styled from 'styled-components'
import {
    HashRouter as Router,
    Switch,
    Route,
    NavLink,
    useLocation
} from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { TableContainer } from 'components/Container'
import { Cell, HoverRow, StyledTHeader, StyledTBody } from 'components/Table'
import { getLPList } from 'lib'
import { H4, H6 } from 'components/Text'
import LPAsset from 'components/Asset/LPAsset'
import LPStaking from './LPStaking'
import LPUnstaking from './LPUnstaking'
import LPReward from './LPReward'

import * as S from './styles'
import { useEffect } from 'react';
const LP = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const actions = [
        'staking',
        'unstaking',
        'reward',
    ]

    useEffect( () => {
        getLPList();
    }, [])

    return (
        <>
            <S.Container>
                <LPContainer>
                    <StyledTHeader>
                        <LPTableCell><H6>PooL</H6></LPTableCell>
                        <LPTableCell><H6>Liquidity</H6></LPTableCell>
                        <LPTableCell><H6>Staked</H6></LPTableCell>
                        <LPTableCell><H6>Rewards</H6></LPTableCell>
                    </StyledTHeader>
                    <LPCStyledTBody>
                        <NavLink to={"/lp/PERI&ETH"}>
                            <HoverRow>
                                <LPTableCell>
                                    <LPAsset currencyName={'PERI_ETH'} label={'PERI/ETH LP'}></LPAsset>
                                </LPTableCell>
                                <LPTableCell><H6>0.0000</H6></LPTableCell>
                                <LPTableCell><H6>0.0000</H6></LPTableCell>
                                <LPTableCell><H6>0.0000</H6></LPTableCell>
                            </HoverRow>
                        </NavLink>
                    </LPCStyledTBody>
                </LPContainer>
            </S.Container>
            <S.Container>
                <Router basename="/lp">
                    <Switch>
                        <Route exact path="/">
                            <S.IntroContainer>
                                <S.IntroTitle>
                                    {t('lp.intro.title')}
                                </S.IntroTitle>
                                <S.IntroSubTitle weigth={"regular"}>
                                    {t('lp.intro.subTitle')}
                                </S.IntroSubTitle>
                            </S.IntroContainer> 
                        </Route>
                        <Route exact path="/:pair">
                            <S.ActionButtonRow>
                                {actions.map((action) => 
                                    (<S.ActionButtonContainer to={`${location.pathname.replace('/lp', '')}/${action}`} key={action}>
                                        <S.ActionImage src={`/images/dark/actions/${action}.svg`}></S.ActionImage>
                                        <H4 weigth={'bold'}>{action.toLocaleUpperCase()}</H4>
                                        <H6>{t(`home.${action}.subTitle`)}</H6>
                                    </S.ActionButtonContainer>)
                                )}
                            </S.ActionButtonRow>
                        </Route>
                        <Route exact path="/:pair/Staking">
                        <LPStaking></LPStaking>
                        </Route>
                        <Route exact path="/:pair/unstaking">
                        <LPUnstaking></LPUnstaking>
                        </Route>
                        <Route exact path="/:pair/reward">
                        <LPReward></LPReward>
                        </Route>
                    </Switch>
                </Router>
            </S.Container>
        </>


        // <Action title="LP Staking & Reward"
        //     subTitles={[
        //         "This leads to the process for staking the LP tokens",
        //         "You add to the PERI Uniswap pools and earning PERI rewards."
        //     ]}
        // >
            // <Switch>
            //     <Route exact path="/lp/:type">
                    
            //     </Route>
            
            // </Switch>



        // </Action>
    );
}

const LPCStyledTBody = styled(StyledTBody)`
    height: 360px;
`

const LPContainer = styled(TableContainer)`
    height: 100%;
    margin: 0;
`

const LPTableCell = styled(Cell)`
    padding: 5px 10px;
`

export default LP;