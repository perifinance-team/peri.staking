import { createSlice } from "@reduxjs/toolkit";

export type LiquidState = {
	liquidation?: boolean;
	thisState: any;
	list: any;
	notification: any;
	timestamp: number;
};

const initialState: LiquidState = {
	liquidation: true,
	list: [],
	thisState: {
		idx: "oxlx1y",
		cRatio: "0",
		debt: 0,
		collateral: [
			{ name: "Peri", value: 0 },
			{ name: "Dai", value: 0 },
			{ name: "USDC", value: 0 },
		],
		status: 0,
	},
	timestamp: 0,
	notification: { toggle: false, title: 1 },
};

export const TransactionSlice = createSlice({
	name: "liquidation",
	initialState,
	reducers: {
		toggleLiquid(state, actions) {
			state.liquidation = actions.payload;
		},
		toggleNoti(state, action) {
			state.notification = action.payload;
		},
		getTaken(state, actions) {
			state.list[actions.payload].status = 2;
		},
		updateList(state, actions) {
			state.list = actions.payload;
		},
		updateThisState(state, actions) {
			state.thisState = actions.payload;
		},
		updateTimestamp(state, actions) {
			state.timestamp = actions.payload;
		},
	},
});

export const { toggleLiquid, toggleNoti, getTaken, updateList, updateThisState, updateTimestamp } = TransactionSlice.actions;

export default TransactionSlice.reducer;
