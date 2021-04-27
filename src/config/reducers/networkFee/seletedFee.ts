import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type value = {
	price: number
	wait: number
}
export type seletedFeeState = {
	seletedFee: value,
}

const initialState: seletedFeeState = {
	seletedFee: {
		price: 0,
		wait: 0
	},
}


export const seletedFeeSlice = createSlice({
	name: 'seletedFee',
	initialState,
	reducers: {
		updateSelectedFee(state, actions: PayloadAction<value>) {
			state.seletedFee.price = actions.payload.price;
			state.seletedFee.wait = actions.payload.wait;
		},
	},
});

export const { updateSelectedFee } = seletedFeeSlice.actions;

export default seletedFeeSlice.reducer;