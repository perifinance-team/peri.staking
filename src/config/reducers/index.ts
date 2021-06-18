import { combineReducers } from "@reduxjs/toolkit";

import app from './app/app'

import wallet from './wallet/wallet'
import walletList from './wallet/walletList'
import isConnectedWallet from './wallet/isConnectedWallet'
import balances from './wallet/balances'

import theme from './theme/theme';
import themeStyles from './theme/themeStyles'

import exchangeRates from './rates/exchangeRates'
import ratio from './rates/ratio'

import networkFee from './networkFee/networkFee'
import seletedFee from './networkFee/seletedFee'

import transaction from './transaction/transaction' 
import vestable from './vest/vestable'

const reducer = combineReducers({
    app,
    theme,
    wallet,
    walletList,
    balances,
    isConnectedWallet,
    themeStyles,
    exchangeRates,
    ratio,
    networkFee,
    seletedFee,
    transaction,
    vestable
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;

// export default reducer;
