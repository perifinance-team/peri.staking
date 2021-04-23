import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TransferablePeri = string;
type Balances = {
	coinName: string,
	balance: string,
	balanceToUSD?: string,
}
type BalanceState = {
    balances: Array<Balances>,
	PERI: Balances,
    transferablePeri: TransferablePeri
}

const initialState: BalanceState = {
    balances: [],
	PERI: {coinName: 'PERI', balance: '0.0'},
	transferablePeri: '0.00'
}


export const ExchangeRatesSlice = createSlice({
	name: 'exchangeRates',
	initialState,
	reducers: {
		updateBalances(state,  actions: PayloadAction<BalanceState>) {
			state.balances = [];
			state.balances = state.balances.concat(actions.payload.balances);
			state.PERI.balance = actions.payload.PERI.balance;
            state.transferablePeri = actions.payload.transferablePeri;
		},
	},
});

export const { updateBalances } = ExchangeRatesSlice.actions;

export default ExchangeRatesSlice.reducer;