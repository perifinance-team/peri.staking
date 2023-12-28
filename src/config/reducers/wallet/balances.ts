import { createSlice } from "@reduxjs/toolkit";

export type PynthBalance = {
  currencyName: string;
  amount: bigint;
  usdBalance: bigint;
};

type BalanceState = {
  isReady: boolean;
  balances: Object;
  pynthBalances: PynthBalance[];
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
  pynthBalances: [],
};

export const ExchangeRatesSlice = createSlice({
  name: "exchangeRates",
  initialState,
  reducers: {
    setBalances(state, actions) {
      const balances = { ...actions.payload };
      return { ...state, isReady: true, balances: balances };
    },
    setIsNotReady(state) {
      return { ...state, isReady: false };
    },
    updateBalance(state, actions) {
      const balances = { ...state.balances };
      const tokenState = { ...balances[actions.payload.currencyName] };
      tokenState[actions.payload.value] = actions.payload.amount;
      balances[actions.payload.currencyName] = tokenState;

      return { ...state, balances: balances };
    },
    clearBalances(state) {
      const balances = { ...state.balances };
      Object.keys(balances).forEach((e) => {
        const element = { ...balances[e] };
        Object.keys(element).forEach((a) => {
          if (a !== "decimal" && a !== "active") {
            element[a] = 0n;
          }
        });
        balances[e] = element;
      });

      return { ...state, isReady: false, balances: balances };
    },
    updatePynths(state, actions) {
      return { ...state, pynthBalances: actions.payload };
    },
    clearPynths(state) {
      return { ...state, pynthBalances: [] };
    },
  },
});

export const {
  setBalances,
  setIsNotReady,
  updateBalance,
  clearBalances,
  updatePynths,
  clearPynths,
} = ExchangeRatesSlice.actions;

export default ExchangeRatesSlice.reducer;
