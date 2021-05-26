import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TransferablePERI = string;
type Balances = {
	coinName: string,
	balance: string,
	balanceToUSD?: string,
}
type BalanceState = {
    balances: Array<Balances>,
	PERI: Balances,
    transferablePERI: TransferablePERI,
	stakedUSDCamount: string,
}

const initialState: BalanceState = {
    balances: [],
	PERI: {coinName: 'PERI', balance: '0.0'},
	transferablePERI: '0.00',
	stakedUSDCamount: '0.00'
}


export const ExchangeRatesSlice = createSlice({
	name: 'exchangeRates',
	initialState,
	reducers: {
		updateBalances(state,  actions: PayloadAction<BalanceState>) {
			state.balances = [];
			state.balances = state.balances.concat(actions.payload.balances);
			state.PERI.balance = actions.payload.PERI.balance;
            state.transferablePERI = actions.payload.transferablePERI;
			state.stakedUSDCamount = actions.payload.stakedUSDCamount;
		},
	},
});

export const { updateBalances } = ExchangeRatesSlice.actions;

export default ExchangeRatesSlice.reducer;