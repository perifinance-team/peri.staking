import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LiquidState = {
  liquidation: boolean;
  thisState: any;
  list: any;
  notification: any;
};

// ratio가 150아래로 떨어졌을때 대상자에 넣어주면됨
const initialState: LiquidState = {
  liquidation: true, // 청산대상자 여부
  list: [],
  thisState: [
    {
      idx: "oxlx2y",
      cRatio: "140",
      debt: 100,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 5 },
        { name: "USDC", value: 5 },
      ],
      status: 0,
    },
  ],
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
  },
});

export const { toggleLiquid, toggleNoti, getTaken, updateList } =
  TransactionSlice.actions;

export default TransactionSlice.reducer;
