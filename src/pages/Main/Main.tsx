import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import { NotificationManager } from 'react-notifications';

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

import Home from '../Home'
import Escrow from '../Escrow'
import Depot from '../Depot'
import Staking from '../Staking'
import Burn from '../Burn'
import Claim from '../Claim'
import Trade from '../Trade'
import Transactions from '../Transactions'
import Track from '../Track'
import LP from '../LP'

import MainHeader from 'screens/Header/MainHeader';
import Footer from 'screens/Footer'

import WalletConnection from '../Wallet'
import * as S from './styled'


const Main = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const { isReady } = useSelector((state: RootState) => state.app);
    const wallet = useSelector((state: RootState) => state.wallet);
    const isConnectedWallet = useSelector((state: RootState) => state.isConnectedWallet.isConnectedWallet);
    const themeState = useSelector((state: RootState) => state.theme.theme);
    const transaction = useSelector((state: RootState) => state.transaction);

    const connectWallet = useCallback(async () => {
        const currentWallet = await connectHelper(wallet.walletType);
        dispatch(updateWallet(currentWallet));
        if (currentWallet.unlocked) {
            dispatch(updateIsConnected(true));
        }
    }, []);

    const getDatas = useCallback(async () => {
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
            console.log(e);
        }
        dispatch(setIsLoading(false));
    }, []);

    useEffect(() => {
        getDatas();
    },[wallet])

    useEffect(() => {
        const init = async () => {
            dispatch(initWallet());
            changeNetwork();
            dispatch(updateThemeStyles(themeState));
            if (wallet?.unlocked) {
                await connectWallet();
            } else {
                dispatch(updateIsConnected(false));
                history.push('/login');
            }
            dispatch(setAppReady());
        };
        init();
        
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(isConnectedWallet) {
            changeAccount( async () => {
                await connectWallet();     
            }, () => { dispatch(clearWallet()); dispatch(updateIsConnected(false)); });
        }
        
        // eslint-disable-next-line
    }, [isConnectedWallet]);

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
                        await getDatas();
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
        { isReady ? (
            <>
                <Router>
                    <MainHeader /> 
                    <S.BodyContainer>
                        <Switch>
                            <Route exact path="/">
                                <Home></Home>
                            </Route>
                            <Route path="/walletConnection">
                                <WalletConnection></WalletConnection>
                            </Route>
                            <Route path="/staking">
                                <Staking></Staking>
                            </Route>
                            <Route path="/burn">
                                <Burn></Burn>
                            </Route>
                            <Route path="/claim">
                                <Claim></Claim>
                            </Route>
                            <Route path="/trade">
                                <Trade></Trade>
                            </Route>
                            <Route path="/transactions">
                                <Transactions></Transactions>
                            </Route>
                            <Route path="/track">
                                <Track></Track>
                            </Route>
                            <Route path="/escrow">
                                <Escrow></Escrow>
                            </Route>
                            <Route path="/depot">
                                <Depot></Depot>
                            </Route>
                            <Route path="/lp">
                                <LP></LP>
                            </Route>
                        </Switch>
                    </S.BodyContainer>
                </Router>
                <Footer></Footer>
            </>
            ) : null}
        </>
    );
}

export default Main;