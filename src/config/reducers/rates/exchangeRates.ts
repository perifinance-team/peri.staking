import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ExchangeRatesState = {
	PERI: string,
	ETH: string,
	iBTC: string,
	iETH: string,
	pBTC: string,
	pETH: string,
}

const initialState: ExchangeRatesState = {
	PERI: "0.00",
	ETH: "0.00",
	iBTC: "0.00",
	iETH: "0.00",
	pBTC: "0.00",
	pETH: "0.00",
}


export const ExchangeRatesSlice = createSlice({
	name: 'exchangeRates',
	initialState,
	reducers: {
		updateExchangeRates(state,  actions: PayloadAction<ExchangeRatesState>) {
			state.PERI = actions.payload.PERI;
			state.ETH = actions.payload.ETH;
			state.iBTC = actions.payload.iBTC;
			state.iETH = actions.payload.iETH;
			state.pBTC = actions.payload.pBTC;
			state.pETH = actions.payload.pETH;
		},
	},
});

export const { updateExchangeRates } = ExchangeRatesSlice.actions;

export default ExchangeRatesSlice.reducer;