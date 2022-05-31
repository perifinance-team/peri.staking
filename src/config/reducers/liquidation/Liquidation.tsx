import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LiquidState = {
  liquidation?: boolean;
  thisState: any;
  list: any;
  notification: any;
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
  notification: { toggle: false, title: 1 },
};

export const TransactionSlice = createSlice({
  name: "liquidation",
  initialState,
  reducers: {
    toggleLiquid(state, actions) {
      state.liquidation = actions.payload.liquidation;
    },
    toggleNoti(state, action) {
      state.notification = action.payload;
    },
    getTaken(state, actions) {
      state.list.forEach((el: any) => {
        if (el.idx === actions.payload) {
          el.status = 1;
        }
      });
    },
    updateList(state, actions) {
      state.list = actions.payload;
    },
    updateThisState(state, actions) {
      state.thisState = actions.payload;
    },
  },
});

export const {
  toggleLiquid,
  toggleNoti,
  getTaken,
  updateList,
  updateThisState,
} = TransactionSlice.actions;

export default TransactionSlice.reducer;
