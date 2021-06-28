import { createSlice } from '@reduxjs/toolkit';

export type AppSliceState = {
	isLPConnect: boolean;
};

const initialState: AppSliceState = {
	isLPConnect: false
};

export const lpSlice = createSlice({
	name: 'lp',
	initialState,
	reducers: {
		setLPConnect: (state, actions) => {
			state.isLPConnect = actions.payload;
		},
	},
});

export const {
	setLPConnect,
} = lpSlice.actions;

export default lpSlice.reducer;
