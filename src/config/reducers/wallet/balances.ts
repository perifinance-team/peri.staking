import { createSlice } from "@reduxjs/toolkit";

export type PynthBalance = {
  currencyName: string;
  amount: bigint;
  usdBalance: bigint;
};

type BalanceState = {
  isLoading: boolean;
  isReady: boolean;
  balances: Object;
  pynthBalances: PynthBalance[];
};

const initialState: BalanceState = {
  isLoading: false,
  isReady: false,
  balances: {
    DEBT: {
      decimal: 18,
      staking: false,
      stable: false,
    },
    PERI: {
      decimal: 18,
      staking: true,
      stable: false,
    },
    pUSD: {
      decimal: 18,
      staking: false,
      stable: true,
    },
    LP: {
      decimal: 18,
      staking: false,
      stable: false,
    },
    USDC: {
      decimal: 6,
      staking: true,
      stable: true,
    },
    DAI: {
      decimal: 18,
      staking: true,
      stable: true,
    },
    USDT: {
      decimal: 6,
      staking: true,
      stable: true,
    },
    PAXG: {
      decimal: 18,
      staking: true,
      stable: false,
    },
    XAUT: {
      decimal: 6,
      staking: true,
      stable: false,
    },
  },
  pynthBalances: [],
};

export const ExchangeRatesSlice = createSlice({
  name: "balances",
  initialState,
  reducers: {
    setBalances(state, actions) {
      const balances = { ...actions.payload };
      return { ...state, isReady: true, isLoading: false, balances: balances };
    },
    setIsReady(state, actions) {
      return { ...state, isReady: actions.payload };
    },
    setIsLoading(state, actions) {
      return { ...state, isLoading: actions.payload };
    },
    updateBalance(state, actions) {
      const balances = { ...state.balances };
      const tokenState = { ...balances[actions.payload.currencyName] };
      tokenState[actions.payload.value] = actions.payload.amount;
      balances[actions.payload.currencyName] = tokenState;

      return { ...state, balances: balances};
    },
    clearBalances(state) {
      const balances = { ...state.balances };
      Object.keys(balances).forEach((e) => {
        const element = { ...balances[e] };
        Object.keys(element).forEach((a) => {
          if (!["decimal", "staking", "stable"].includes(a)) {
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

export const { setBalances, setIsReady, setIsLoading, updateBalance, clearBalances, updatePynths, clearPynths } =
  ExchangeRatesSlice.actions;

export default ExchangeRatesSlice.reducer;
