import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from 'config/reducers'

import Home from '../Home'
import Escrow from '../Escrow'
import Depot from '../Depot'
import Stake from '../Stake'
import Burn from '../Burn'
import Claim from '../Claim'
import Trade from '../Trade'
import Transcations from '../Transcations'
import Track from '../Track'
import LP from '../LP'

import Footer from 'screens/Footer'

import WalletConnection from '../Wallet'

import * as S from './styled'

const Main = () => {
  const isFetched = useSelector((state: RootState) => state.app.isFetched);
  return (
    <>
      <S.BodyContainer>
        <Router>
          <Switch>
              <Route exact path="/">
                <Home></Home>
              </Route>
              <Route path="/walletConnection">
                <WalletConnection></WalletConnection>
              </Route>
              <Route path="/stake">
                <Stake></Stake>
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
              <Route path="/transcations">
                <Transcations></Transcations>
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
              <Route path="/transcations">
                <Transcations></Transcations>
              </Route>
              <Route path="/lp">
                <LP></LP>
              </Route>
            </Switch>
        </Router>
      </S.BodyContainer>
      <Footer></Footer>
    </>
  );
}

export default Main;