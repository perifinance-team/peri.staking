import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type value = {
	price: number
	wait: number
}
export type NetworkFeeState = {
	AVERAGE: value
	FAST: value
}

const initialState: NetworkFeeState = {
	AVERAGE: {
		price: 0,
		wait: 0
	},
	FAST: {
		price: 0,
		wait: 0
	},
}


export const NetworkFeeSlice = createSlice({
	name: 'networkFee',
	initialState,
	reducers: {
		updateNetworkFee(state, actions: PayloadAction<NetworkFeeState>) {
			state.AVERAGE = actions.payload.AVERAGE;
			state.FAST = actions.payload.FAST;
		},
	},
});

export const { updateNetworkFee } = NetworkFeeSlice.actions;

export default NetworkFeeSlice.reducer;