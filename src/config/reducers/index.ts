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
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;

// export default reducer;
