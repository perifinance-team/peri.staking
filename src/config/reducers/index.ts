import { combineReducers } from "@reduxjs/toolkit";


import app from './app/app'
import theme from './theme/theme';
import wallet from './wallet/wallet'
import walletList from './wallet/walletList'
import isConnectedWallet from './wallet/isConnectedWallet'
import themeStyles from './theme/themeStyles'

const reducer = combineReducers({
    app,
    theme,
    wallet,
    walletList,
    isConnectedWallet,
    themeStyles
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;

// export default reducer;
