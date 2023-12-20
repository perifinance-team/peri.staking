import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ExchangeRatesState = {
    isReady?: boolean;
    PERI: bigint;
    USDC: bigint;
    DAI: bigint;
};

const initialState: ExchangeRatesState = {
    isReady: false,
    PERI: 0n,
    USDC: 0n,
    DAI: 0n,
};

export const ExchangeRatesSlice = createSlice({
    name: "exchangeRates",
    initialState,
    reducers: {
        updateExchangeRates(state, actions: PayloadAction<ExchangeRatesState>) {
			const rateState = actions.payload;
            return { ...state, isReady: true, PERI: rateState.PERI, USDC: rateState.USDC, DAI: rateState.DAI };
        },
    },
});

export const { updateExchangeRates } = ExchangeRatesSlice.actions;

export default ExchangeRatesSlice.reducer;
