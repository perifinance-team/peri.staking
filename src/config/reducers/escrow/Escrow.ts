import { createSlice } from "@reduxjs/toolkit";

export type EscrowState = {
	isReady: boolean;
    escrowList: any;
};

const initialState: EscrowState = {
	isReady: false,
    escrowList: [],
};

export const EscrowSlice = createSlice({
    name: "escrow",
    initialState,
    reducers: {
        updateEscrowList(state, actions) {
            return { ...state, isReady:true, escrowList: actions.payload };
        },
		setReady(state, actions) {
			return { ...state, isReady: actions.payload };
		}
    },
});

export const { updateEscrowList, setReady } = EscrowSlice.actions;

export default EscrowSlice.reducer;
