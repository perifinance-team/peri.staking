import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VestState = {
	vestable: boolean
}

const initialState: VestState = {
	vestable: false
}

export const TransactionSlice = createSlice({
	name: 'vestable',
	initialState,
	reducers: {
		updateVestable(state,  actions: PayloadAction<VestState>) {
			state.vestable = actions.payload.vestable
		},
	},
});

export const { updateVestable } = TransactionSlice.actions;

export default TransactionSlice.reducer;
