import { createSlice } from '@reduxjs/toolkit';

export type Loading = {
	loadings: object;
};

const initialState: Loading = {
	loadings: {
        balance: false,
        apy: false,
        burnAble: false,
        gasEstimate: false,
		closeCurrentFeePeriod: false,
		rewardData: false,
		vestingData: false
    },
};

export const loadingSlice = createSlice({
	name: 'loading',
	initialState,
	reducers: {
		setLoading: (state, actions) => {
			state.loadings[actions.payload.name] = actions.payload.value;
			console.log(actions);
		},
	},
});

export const {
	setLoading,
} = loadingSlice.actions;

export default loadingSlice.reducer;
