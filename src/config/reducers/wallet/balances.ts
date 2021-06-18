import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BalanceState = {
    balances: Object,
	transferables: Object,
}

const initialState: BalanceState = {
    balances: {},
	transferables: {},
}


export const ExchangeRatesSlice = createSlice({
	name: 'exchangeRates',
	initialState,
	reducers: {
		updateBalances(state,  actions: PayloadAction<BalanceState>) {
			state.balances = actions.payload.balances
			state.transferables = actions.payload.transferables
		},
	},
});

export const { updateBalances } = ExchangeRatesSlice.actions;

export default ExchangeRatesSlice.reducer;