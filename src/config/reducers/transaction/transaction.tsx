import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransactionState = {
	hash: string,
	message: string,
	type: string
}

const initialState: TransactionState = {
	hash: undefined,
	message: undefined,
	type: undefined
}

export const TransactionSlice = createSlice({
	name: 'transaction',
	initialState,
	reducers: {
		resetTransaction(state) {
			return { ...state, hash: undefined, message: undefined, type: undefined}
		},
		updateTransaction(state,  actions: PayloadAction<TransactionState>) {
			return { ...state, hash: actions.payload.hash, message: actions.payload.message, type: actions.payload.type}
		},
	},
});

export const { resetTransaction, updateTransaction } = TransactionSlice.actions;

export default TransactionSlice.reducer;
