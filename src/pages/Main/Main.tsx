import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

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
    return (
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
    );
}

export default Main;