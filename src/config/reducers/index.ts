import { combineReducers } from "@reduxjs/toolkit";

import app from "./app/app";

import wallet from "./wallet/wallet";
import balances from "./wallet/balances";

import theme from "./theme/theme";
import themeStyles from "./theme/themeStyles";

import exchangeRates from "./rates/exchangeRates";
import ratio from "./rates/ratio";

import networkFee from "./networkFee/networkFee";

import transaction from "./transaction/transaction";
import vestable from "./vest/vestable";
import lp from "./LP/lp";
import loading from "./loading/loading";
import liquidation from "./liquidation/Liquidation";

const reducer = combineReducers({
  app,
  theme,
  wallet,
  balances,
  themeStyles,
  exchangeRates,
  ratio,
  networkFee,
  transaction,
  vestable,
  lp,
  loading,
  liquidation,
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;

// export default reducer;
