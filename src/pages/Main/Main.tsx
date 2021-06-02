import { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"

import {
    HashRouter as Router,
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
import Staking from '../Staking/Staking'
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
    const { walletType, unlocked, currentWallet } = useSelector((state: RootState) => state.wallet);
    const isConnectedWallet = useSelector((state: RootState) => state.isConnectedWallet.isConnectedWallet);
    const themeState = useSelector((state: RootState) => state.theme.theme);
    const transaction = useSelector((state: RootState) => state.transaction);
    const dataIntervalTime = 1000 * 60 * 3;
    const [intervals, setIntervals] = useState({data: null});
    
    const connectWallet = useCallback(async () => {
        const currentWallet = await connectHelper(walletType);
        
        dispatch(updateWallet(currentWallet));
        if (currentWallet.unlocked) {
            dispatch(updateIsConnected(true));
        }
        await getDatas(currentWallet.currentWallet);
        setIntervals(
            {data: setInterval( async () => {
                dispatch(setIsLoading(true));
                await getDatas(currentWallet.currentWallet)
                dispatch(setIsLoading(false));
            }, dataIntervalTime) }
        )
        // eslint-disable-next-line
    }, []);

    const getDatas = useCallback(async (currentWallet) => {
        dispatch(setIsLoading(true));
        try {
            const exchangeRates = await getExchangeRates();
            dispatch(updateExchangeRates(exchangeRates));
            const ratios = await getRatio(currentWallet);
            dispatch(updateRatio(ratios));
            const balances = await getBalancess(currentWallet);
            dispatch(updateBalances(balances));
            const networkFee = await getNetworkFee();
            dispatch(updateNetworkFee(networkFee));
        } catch(e) {
            console.log(e);
        }
        dispatch(setIsLoading(false));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const init = async () => {
            dispatch(initWallet());
            changeNetwork();
            dispatch(updateThemeStyles(themeState));
            if (unlocked) {
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
                clearInterval(intervals.data);
                setIntervals({data: null});
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
                        await getDatas(currentWallet);
                    } else {
                        NotificationManager.error(`${transaction.type} error`, 'error');
                    }
                } else {
                    setTimeout(() => getState(false), 1000);
                }
            }
            getState(true);
        }
        // eslint-disable-next-line
    }, [transaction])

    return (
        <>
        { isReady ? (
            <>
                <Router>
                    <MainHeader /> 
                    <S.BodyContainer>
                        {isConnectedWallet && 
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
                        }
                        
                    </S.BodyContainer>
                </Router>
                <Footer></Footer>
            </>
            ) : null}
        </>
    );
}

export default Main;