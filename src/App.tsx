import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { ThemeProvider } from 'styled-components'
import { NotificationContainer, NotificationManager } from 'react-notifications';

import { RootState } from 'config/reducers'
import { setAppReady, setIsLoading } from 'config/reducers/app'
import { updateThemeStyles } from 'config/reducers/theme'
import { updateWallet, initWallet, clearWallet, updateIsConnected } from 'config/reducers/wallet'
import { updateBalances } from 'config/reducers/wallet/balances'
import { updateExchangeRates, updateRatio } from 'config/reducers/rates'
import { updateNetworkFee } from 'config/reducers/networkFee'
import { resetTransaction } from 'config/reducers/transaction'


import { connectHelper } from 'helpers/wallet/connect'
import { changeAccount, changeNetwork } from 'helpers/wallet/change'
import { getNetworkFee } from 'helpers/defipulse'
import { pynthetix, getExchangeRates, getRatio, getBalancess } from 'lib'
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
    
    const dispatch = useDispatch();
    const {isReady, isLoading} = useSelector((state: RootState) => state.app);
    const wallet = useSelector((state: RootState) => state.wallet);
    const isConnectedWallet = useSelector((state: RootState) => state.isConnectedWallet.isConnectedWallet);
    const themeState = useSelector((state: RootState) => state.theme.theme);
    const themeStyles = useSelector((state: RootState) => state.themeStyles.styles);
    const transaction = useSelector((state: RootState) => state.transaction);

    const connectWallet = async () => {
        const connect = await connectHelper(wallet.walletType);
        dispatch(updateWallet(connect));
        return connect;
    }

    useEffect(() => {
        const getDatas = async () => {
            dispatch(setIsLoading(true));
            try {
                const exchangeRates = await getExchangeRates();
                dispatch(updateExchangeRates(exchangeRates));
                const ratios = await getRatio(wallet.currentWallet);
                dispatch(updateRatio(ratios));
                const balances = await getBalancess(wallet.currentWallet);
                dispatch(updateBalances(balances));
                const networkFee = await getNetworkFee();
                dispatch(updateNetworkFee(networkFee));
                
            } catch(e) {
                
            }
            dispatch(setIsLoading(false));
        }

        const init = async () => {
            dispatch(initWallet());
            changeNetwork();
            dispatch(updateThemeStyles(themeState));
            if (wallet?.unlocked) {
                const currentWallet = await connectWallet();
                if (currentWallet.unlocked) {
                    dispatch(updateIsConnected(true));
                    await getDatas();
                }
            } else {
                dispatch(updateIsConnected(false));
            }
            dispatch(setAppReady());
        };
        init();
        
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (wallet.unlocked && isConnectedWallet) {
            changeAccount(connectWallet, () => { dispatch(clearWallet()); dispatch(updateIsConnected(false)); });
        }
        
        // eslint-disable-next-line
    }, [wallet, isConnectedWallet]);

    useEffect(() => {
        if(transaction.hash) {
            
            const getState = async (init) => {
                if(init) {
                    NotificationManager.info(transaction.message, 'in progress', 0);
                }
                const state = await pynthetix.provider.getTransactionReceipt(transaction.hash);
                if(state) {
                    NotificationManager.remove(NotificationManager.listNotify[0])
                    if(state.status === 1) {
                        dispatch(resetTransaction());
                        NotificationManager.success(`${transaction.type} success`, 'success');
                    } else {
                        NotificationManager.error(`${transaction.type} success`, 'success');
                    }
                } else {
                    setTimeout(() => getState(false), 1000);
                }
            }
            getState(true);
        }
    }, [transaction])
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
            { isReady || isConnectedWallet !== undefined ?
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
                                        { isConnectedWallet ? <Main /> : <Redirect to={{ pathname: "/login" }}/> }
                                    </Route>
                                </Switch>
                            </Router>
                        </BodyContainer>
                    </ThemeProvider>
                </>
                : null
            }
            <NotificationContainer/>
        </>

    );
}

export default App;