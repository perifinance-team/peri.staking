import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { ThemeProvider } from 'styled-components'
import { NotificationContainer } from 'react-notifications';

import { RootState } from 'config/reducers'
import { updateWalletNetwork } from 'config/reducers/wallet'

import { BodyContainer } from 'components/Container'

import { setAppReady } from 'config/reducers/app'
import { updateThemeStyles } from 'config/reducers/theme'
import { changeNetwork } from 'helpers/wallet/change'

import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Login from 'pages/Login';
import Main from 'pages/Main';
import Wallet from 'pages/Wallet'
import SubHeader from 'screens/Header/SubHeader';
import './App.css'

const App = () => {
    const { isLoading } = useSelector((state: RootState) => state.app);
    const themeStyles = useSelector((state: RootState) => state.themeStyles.styles);
    const themeState = useSelector((state: RootState) => state.theme.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateThemeStyles(themeState));
        changeNetwork((chainID) => { dispatch(updateWalletNetwork(chainID))});
        dispatch(setAppReady());
        // eslint-disable-next-line
    }, []);

    return (
        <>     
            {
                isLoading ? (<div className="loading-back">
                    <div className="loading-container">
                        <div className="loading"></div>
                        <div id="loading-text">loading</div>
                    </div>
                </div>) : null
            }
            
            <>
                <ThemeProvider theme={themeStyles}>
                    <BodyContainer>
                        <Router>
                            <Switch>
                                <Route path="/walletConnection" >
                                    <SubHeader />
                                    <Wallet></Wallet>
                                </Route>
                                <Route path="/login">
                                    <SubHeader />
                                    <Login />
                                </Route>
                                <Route path="/">
                                    <Main />
                                </Route>
                            </Switch>
                        </Router>
                    </BodyContainer>
                </ThemeProvider>
            </>
            
            <NotificationContainer/>
        </>

    );
}

export default App;