import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RatiosState = {
    currentCRatio: string
	targetCRatio: string
    liquidationRatio: string
}

const initialState: RatiosState = {
	currentCRatio: '0',
	targetCRatio: '0',
    liquidationRatio: '0',
}

export const RatioSlice = createSlice({
	name: 'ratio',
	initialState,
	reducers: {
		updateRatio(state,  actions: PayloadAction<RatiosState>) {
			state.currentCRatio = actions.payload.currentCRatio;
			state.targetCRatio = actions.payload.targetCRatio;
			state.liquidationRatio = actions.payload.liquidationRatio;
		},
	},
});

export const { updateRatio } = RatioSlice.actions;

export default RatioSlice.reducer;