import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LiquidState = {
  liquidation: boolean;
  timestamp: number;
  temp: any;
  list: any;
  notification: boolean;
};

let today = new Date();
let startTime = today.getTime();

// ratio가 150아래로 떨어졌을때 대상자에 넣어주면됨
const initialState: LiquidState = {
  liquidation: false, // 청산대상자 여부
  timestamp: startTime,
  temp: [
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
    {
      idx: "oxlx3y",
      cRatio: "120",
      debt: 50,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 5 },
        { name: "USDC", value: 0 },
      ],
      status: 1,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
    {
      idx: "oxlx4y",
      cRatio: "110",
      debt: 500,
      collateral: [
        { name: "Peri", value: 95 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 5 },
      ],
      status: 2,
    },
  ],
  list: [],
  notification: false, // 알림창 여부
};

export const TransactionSlice = createSlice({
  name: "liquidation",
  initialState,
  reducers: {
    toggleLiquid(state, actions) {
      state.liquidation = actions.payload.liquidation;
    },
    ratioAdd(state, actions: PayloadAction<LiquidState>) {
      state.temp = actions.payload.temp;
    },
    toggleNoti(state, action) {
      state.notification = action.payload.notification;
    },
    getTaken(state, actions) {
      state.temp.forEach((el: any) => {
        if (el.idx === actions.payload) {
          el.status = 1;
        }
      });
      console.log(state.temp);
    },
    getTimestamp(state, actions) {
      state.timestamp === 0 && (state.timestamp = actions.payload);
    },
  },
});

export const { toggleLiquid, ratioAdd, toggleNoti, getTaken, getTimestamp } =
  TransactionSlice.actions;

export default TransactionSlice.reducer;
