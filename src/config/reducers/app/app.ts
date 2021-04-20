import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppSliceState = {
	isReady: boolean;
	isFetching: boolean;
	isFetched: boolean;
	isRefreshing: boolean;
	fetchError: string | null;
	isSystemUpgrading: boolean;
	isPVT: boolean;
};

const initialState: AppSliceState = {
	isReady: false,
	isFetching: false,
	isFetched: false,
	isRefreshing: false,
	fetchError: null,
	isSystemUpgrading: false,
	isPVT: false,
};

const sliceName = 'app';

export const appSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		setAppReady: state => {
			state.isReady = true;
		},
		fetchAppStatusRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchAppStatusFailure: (state, action: PayloadAction<{ error: string }>) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchAppStatusSuccess: (
			state,
			action: PayloadAction<{ isSystemUpgrading: boolean; isPVT: boolean }>
		) => {
			const { isSystemUpgrading, isPVT } = action.payload;
			state.isSystemUpgrading = isSystemUpgrading;
			state.isPVT = isPVT;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
		setSystemUpgrading: (state, action: PayloadAction<{ reason: boolean }>) => {
			state.isSystemUpgrading = action.payload.reason;
		},
	},
});

export const {
	setAppReady,
	fetchAppStatusRequest,
	fetchAppStatusFailure,
	fetchAppStatusSuccess,
	setSystemUpgrading,
} = appSlice.actions;

export default appSlice.reducer;
