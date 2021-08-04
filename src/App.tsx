import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { ThemeProvider } from 'styled-components'
import { NotificationContainer, NotificationManager } from 'react-notifications';

import { RootState } from 'config/reducers'
import { updateThemeStyles } from 'config/reducers/theme'
import { updateRatio } from 'config/reducers/rates'
import { updateExchangeRates } from 'config/reducers/rates'
import { updateVestable } from 'config/reducers/vest'
import { updateAddress, updateNetwork, updateIsConnect } from 'config/reducers/wallet'
import { updateNetworkFee } from 'config/reducers/networkFee'
import { resetTransaction } from 'config/reducers/transaction'
import { getNetworkFee } from 'lib/fee'
import { SUPPORTED_NETWORKS } from 'lib/network'

import { clearWallet, clearBalances } from 'config/reducers/wallet'
import { updateCRatio } from 'config/reducers/rates'

import { initCurrecy } from 'config/reducers/wallet'
import { InitOnboard, onboard } from 'lib/onboard/onboard'
import { contracts } from 'lib/contract'
import { getVestable } from 'lib/vest'
import { getBalances } from 'lib/balance'
import { getRatios } from 'lib/rates'

import Main from './screens/Main'
import './App.css'


const App = () => {
    const { address, networkId, confirm } = useSelector((state: RootState) => state.wallet);
    const { balances } = useSelector((state: RootState) => state.balances);
    const transaction = useSelector((state: RootState) => state.transaction);
    
    const themeStyles = useSelector((state: RootState) => state.themeStyles.styles);
    const themeState = useSelector((state: RootState) => state.theme.theme);
    
    const dispatch = useDispatch();
    const intervelTime = 1000 * 60 * 3;
    const [ intervals, setIntervals ] = useState(null);
    const [onboardInit, setOnboardInit] = useState(false);

    const getSystemData = useCallback(async () => {
        const ratios = await getRatios(address);
        dispatch(updateRatio(ratios.ratio));
        dispatch(updateExchangeRates(ratios.exchangeRates));
        if(address) {
            const balancesData = await getBalances(address, balances, ratios.exchangeRates, ratios.ratio.targetCRatio, ratios.ratio.currentCRatio);
            dispatch(initCurrecy(balancesData)); 
            //todo:: code move call
            const vestable: boolean = await getVestable(address);
            dispatch(updateVestable({vestable}));
        }
        const gasPrice = await getNetworkFee(networkId);
        
        dispatch(updateNetworkFee({gasPrice}));
    }, [address, networkId])


    const setOnbaord = async () => {
        let networkId = Number(process.env.REACT_APP_DEFAULT_NETWORK_ID);
        contracts.init(networkId);
        dispatch(updateNetwork({networkId: networkId}));

        InitOnboard(networkId, {
            wallet: wallet => {
                if (wallet.provider) {
                    contracts.wallet = wallet;
                    localStorage.setItem('selectedWallet', wallet.name);
                }
            },
            address:async (newAddress) => {
                if(newAddress && onboard.getState().wallet.connect) {
                    if(contracts.wallet && SUPPORTED_NETWORKS[contracts.wallet.provider.networkVersion]) {
                        contracts.connect(newAddress);
                        dispatch(updateAddress({address: newAddress}));
                        dispatch(updateIsConnect(true));
                    } else {
                        contracts.clear();
                        // NotificationManager.warning(`This network is not supported. Please change to bsc or polygon network`, 'ERROR');
                        onboard.walletReset();
                        localStorage.removeItem('selectedWallet');
                        dispatch(updateIsConnect(false));
                        dispatch(clearWallet());
                        dispatch(updateCRatio());
                        dispatch(clearBalances());
                        dispatch(updateVestable({vestable: false}));
                        clearInterval(intervals)
                    }
                }
            },
            network: async (network) => {
                if(network && onboard.getState().wallet.connect) {
                    if(SUPPORTED_NETWORKS[network]) {
                        onboard.config({ networkId: network });
                        dispatch(updateNetwork({networkId: network}));
                        contracts.init(network);
                        const wallet = onboard.getState().wallet;
                        if(wallet.connect) {
                            await wallet.connect();
                            contracts.wallet = onboard.getState().wallet;
                            contracts.connect(address);
                            dispatch(updateIsConnect(true));
                        }
                    } else {
                        onboard.walletReset();
                        onboard.config({ networkId: network });
                        contracts.clear();
                        NotificationManager.warning(`This network is not supported. Please change to bsc or polygon network`, 'ERROR');
                        localStorage.removeItem('selectedWallet');
                        dispatch(updateIsConnect(false));
                        dispatch(clearWallet());
                        dispatch(updateCRatio());
                        dispatch(clearBalances());
                        dispatch(updateVestable({vestable: false}));
                        clearInterval(intervals)
                    }
                } else {
                    onboard.walletReset();
                    onboard.config({ networkId: network });
                    contracts.clear();
                    localStorage.removeItem('selectedWallet');
                    dispatch(updateIsConnect(false));
                    dispatch(clearWallet());
                    dispatch(updateCRatio());
                    dispatch(clearBalances());
                    dispatch(updateVestable({vestable: false}));
                    clearInterval(intervals)
                }
            },
        }, themeState === 'dark' );

        const selectedWallet = localStorage.getItem('selectedWallet');
        
        if(selectedWallet) {
            try {
                await onboard.walletSelect(selectedWallet);
                await onboard.walletCheck();
            } catch(e) {
                console.log(e);
            }
        }
        setOnboardInit(true);
    }

    useEffect(() => {
        if(transaction.hash) {
            const getState = async (init) => {
                const state = await contracts.provider.getTransactionReceipt(transaction.hash);
                if(state) {
                    if(state.status !== 1) {
                        NotificationManager.remove(NotificationManager.listNotify[0])
                        NotificationManager.warning(`${transaction.type} error`, 'ERROR');
                        return false;
                    }

                    if(state.confirmations >= confirm) {
                        await getSystemData();
                        NotificationManager.remove(NotificationManager.listNotify[0])
                        NotificationManager.success(`${transaction.type} success`, 'SUCCESS');
                        dispatch(resetTransaction());
                    } else {
                        setTimeout(() => getState(false), 1000);    
                    }
                } else {
                    setTimeout(() => getState(false), 1000);    
                }
            }
            NotificationManager.info(transaction.message, 'In progress', 0);
            setTimeout(() => getState(true), 1000);
        }
        // eslint-disable-next-line
    }, [transaction])

    useEffect(() => {
        if(!onboardInit) {
            setOnbaord();
        }
        dispatch(updateThemeStyles(themeState));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(onboardInit && networkId !== 0 && (networkId || address)) {
            getSystemData();
            if(intervals) {
                clearInterval(intervals);
            } 
            setIntervals(
                (setInterval(() => getSystemData(), intervelTime))
            )
        }
        // eslint-disable-next-line
    }, [networkId, address, onboardInit]);

    
    
    return (
        <>     
            <ThemeProvider theme={themeStyles}>
                <Main></Main>
            </ThemeProvider>
            <NotificationContainer/>
        </>

    );
}



export default App;