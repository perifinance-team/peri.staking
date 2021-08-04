import { useState } from 'react';
import { useSelector } from "react-redux"
import { useTranslation } from 'react-i18next';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';

import styled, { css } from 'styled-components';

import { RootState } from 'config/reducers'

import { H1, H2 } from 'components/headding'
import { Paragraph } from 'components/paragraph'

import Mint from './Mint'
import Burn from './Burn'
import Reward from './Reward'
import Earn from './Earn'

const Stake = () => {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState<string>('mint');
    const themeState = useSelector((state: RootState) => state.theme.theme);

    return (
        <Router basename="/stake">
            <Switch>
                <Route exact path="/">
                    <Container>
                        <Title>
                            <H1>{t('stake.intro1')}</H1>
                            <H1>{t('stake.intro2')}</H1>
                        </Title>
                        <LinkContainer>
                            {['mint', 'burn', 'reward'].map((link, index) => {
                                return (
                                    <StyledLink to={`/${link}`} active={activeTab === link} margin={index === 1} onMouseOver={() => setActiveTab(link)} key={link}>
                                        <H2>
                                            {link.toLocaleUpperCase()}
                                        </H2>
                                        {activeTab === link ? 
                                            (<img src={`/images/${themeState}/${link}_active.svg`} alt="link"/>) : 
                                            (<img src={`/images/${themeState}/${link}.svg`} alt="link"/>)
                                        }
                                        
                                        <Paragraph fontSize={1.8} weigth={'m'}>
                                            {t(`stake.explanation.${link}`)}
                                        </Paragraph>
                                    </StyledLink>
                                )
                            })}
                        </LinkContainer>
                    </Container>
                </Route>
                <Route exact path="/mint">
                    <Mint></Mint>
                </Route>
                <Route exact path="/burn">
                    <Burn></Burn>
                </Route>
                <Route exact path="/reward">
                    <Reward></Reward>
                </Route>
                <Route exact path="/earn">
                    <Earn></Earn>
                </Route>
            </Switch>
        </Router>
    );
}

const Container = styled.div`
    flex: 1;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Title = styled.div`
    position: absolute;
    z-index: 0;
    top: 5%;
`;

const LinkContainer = styled.div`
    z-index: 1;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 0;
`

const StyledLink = styled(Link)<{active: boolean, margin: boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20%;
    min-width: 180px;
    max-width: 340px;
    height: 40%;
    flex-direction: column;
    margin: ${props => props.margin ? '0px 25px' : ''};
    color: ${props => props.theme.colors.font.primary};
    text-decoration: none;
    border-radius: 20px;
    background-color: ${props => props.theme.colors.background.panel};
    ${
        props => props.active ? 
        css({
            width: '35%',
            'min-width': '200px',
            'max-width': '340px',
            'background-color': props.theme.colors.hover.panel,
        })
        : null
    }

    p {
        height: 70px;
        max-width: 200px;
        min-width: 100px;
        vertical-align: middle;
    }

    img {
        width: 80px;
        height: 80px;
        margin: 20px;
        ${
            props => props.active ? css({width: '120px', height: '90px'}) : null
        }
    }
`

export default Stake;