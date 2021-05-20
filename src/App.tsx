
import { useSelector, useDispatch } from "react-redux"

import { ThemeProvider } from 'styled-components'
import { NotificationContainer } from 'react-notifications';

import { RootState } from 'config/reducers'

import { BodyContainer } from 'components/Container'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import Login from 'pages/Login';
import Main from 'pages/Main';
import Wallet from 'pages/Wallet'
import SubHeader from 'screens/Header/SubHeader';
import './App.css'

const App = () => {
    const { isLoading } = useSelector((state: RootState) => state.app);
    const themeStyles = useSelector((state: RootState) => state.themeStyles.styles);

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