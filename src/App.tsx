import { useEffect } from 'react';
import { useSelector } from "react-redux";

import { ThemeProvider } from 'styled-components';

import { useDispatch } from 'react-redux'
import { updateWallet, initWallet, clearWallet, updateIsConnected} from 'config/reducers/wallet'
import { connectHelper } from 'helpers/wallet/connect'

import { RootState } from 'config/reducers'
import { setAppReady } from 'config/reducers/app';
import { updateThemeStyles } from 'config/reducers/theme'

import { changeAccount, changeNetwork } from 'helpers/wallet/change'

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
import MainHeader from 'screens/Header/MainHeader';
import SubHeader from 'screens/Header/SubHeader';

const App = () => {
  const dispatch = useDispatch();
  const appIsReady = useSelector((state: RootState) => state.app.isReady);
  const wallet = useSelector((state: RootState) => state.wallet);
  const isConnectedWallet = useSelector((state: RootState) => state.isConnectedWallet.isConnectedWallet);
  const themeState = useSelector((state: RootState) => state.theme.theme);
  const themeStyles = useSelector((state: RootState) => state.themeStyles.styles);

  const connectWallet = async () => {
    const connect = await connectHelper(wallet.walletType);
    dispatch(updateWallet(connect));
    return connect;
  }
 
  useEffect(() => {
		const init = async () => {
      dispatch(initWallet());
      changeNetwork();
      dispatch(updateThemeStyles(themeState));
      if(wallet?.unlocked) {
        const currentWallet = await connectWallet();
        if(currentWallet.unlocked) {
          dispatch(updateIsConnected(true));
        }
      }
      //  else {
        // const networkId = getEthereumNetworkId();
        // const provider = getProvider(networkId);
        // pynthetix.setContractSettings({networkId, provider});
      // }
      dispatch(setAppReady());
		};
		init();
    // eslint-disable-next-line
	}, []);

  useEffect(() => { 
    if(wallet.unlocked && isConnectedWallet) {
      changeAccount(connectWallet, () => {dispatch(clearWallet()); dispatch(updateIsConnected(false));});
    }
    // eslint-disable-next-line
  },[wallet, isConnectedWallet]);
  
  return (
      <>
        { appIsReady && 
          <ThemeProvider theme={themeStyles}>
            <BodyContainer>
              { isConnectedWallet ? <MainHeader/> : <SubHeader/>}
              <Router>
                <Switch>
                  <Route path="/walletConnection" >
                    <Wallet></Wallet>
                  </Route>
                  <Route path="/login">
                    <Login/>
                  </Route>
                  <Route path="/">
                  { isConnectedWallet ? <Main/> : <Redirect to={{pathname: "/login"}}/>}
                  </Route>
                </Switch>
              </Router>
            </BodyContainer>
          </ThemeProvider>
        }
      </>
      
  );
}

export default App;