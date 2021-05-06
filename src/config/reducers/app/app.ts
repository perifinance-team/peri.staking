import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppSliceState = {
	isReady: boolean;
	isLoading: boolean;
};

const initialState: AppSliceState = {
	isReady: false,
	isLoading: false,
};

const sliceName = 'app';

export const appSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		setAppReady: state => {
			state.isReady = true;
		},
		setIsLoading: (state, actions) => {
			state.isLoading = actions.payload;
		},
	},
});

export const {
	setAppReady,
	setIsLoading,
} = appSlice.actions;

export default appSlice.reducer;
