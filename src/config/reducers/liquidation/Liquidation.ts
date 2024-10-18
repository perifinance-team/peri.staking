import { createSlice } from "@reduxjs/toolkit";

export type LiquidState = {
    liquidation?: boolean;
    thisState: any;
    list: any;
    listReady: boolean;
    notification: any;
    timestamp: number;
};

const initialState: LiquidState = {
    liquidation: true,
    list: [],
    listReady: false,
    thisState: {
        idx: "oxlx1y",
        cRatio: "0",
        debt: 0,
        collateral: [
            { name: "PERI", value: 0 },
            { name: "DAI", value: 0 },
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
            return { ...state, liquidation: actions.payload };
        },
        toggleNoti(state, actions) {
            return { ...state, notification: actions.payload };
        },
        getTaken(state, actions) {
            const list = { ...state.list };
            list[actions.payload].status = 2;
            return { ...state, list: list };
        },
        updateList(state, actions) {
            return { ...state, listReady: true, list: actions.payload };
        },
        setListReady(state, actions) {
            return { ...state, listReady: actions.payload };
        },
        updateThisState(state, actions) {
            return { ...state, thisState: actions.payload };
        },
        updateTimestamp(state, actions) {
            return { ...state, timestamp: actions.payload };
        },
    },
});

export const { toggleLiquid, toggleNoti, getTaken, updateList, updateThisState, updateTimestamp, setListReady } = TransactionSlice.actions;

export default TransactionSlice.reducer;
