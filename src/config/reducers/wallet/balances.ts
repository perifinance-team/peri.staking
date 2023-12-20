import { createSlice } from "@reduxjs/toolkit";

type BalanceState = {
  isReady: boolean;
  balances: Object;
};

const initialState: BalanceState = {
  isReady: false,
  balances: {
    DEBT: {
      decimal: 18,
      active: true,
    },
    PERI: {
      decimal: 18,
      active: true,
    },
    pUSD: {
      decimal: 18,
      active: true,
    },
    LP: {
      decimal: 18,
      active: true,
    },
    USDC: {
      decimal: 6,
      active: true,
    },
    DAI: {
      decimal: 18,
      active: true,
    },
  },
};

export const ExchangeRatesSlice = createSlice({
  name: "exchangeRates",
  initialState,
  reducers: {
    initCurrency(state, actions) {
      return { ...state, isReady: true, balances: actions.payload };
    },
    updateBalances(state, actions) {
      const balances = { ...state.balances };
      const tokenState = {...balances[actions.payload.currencyName]};
      tokenState[actions.payload.value] = actions.payload.balance;
      balances[actions.payload.currencyName] = tokenState;
      
      return { ...state, balances: balances };
    },
    clearBalances(state) {
      const balances = { ...state.balances };
      Object.keys(balances).forEach((e) => {
        const element = {...balances[e]};
        Object.keys(element).forEach((a) => {
          if (a !== "decimal" && a !== "active") {
            element[a] = 0n;
          }
        });
        balances[e] = element;
      });

      return { ...state, balances: balances };
    },
  },
});

export const { initCurrency, updateBalances, clearBalances } = ExchangeRatesSlice.actions;

export default ExchangeRatesSlice.reducer;
