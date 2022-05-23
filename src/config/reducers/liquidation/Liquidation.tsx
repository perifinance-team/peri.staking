import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LiquidState = {
  liquidation: boolean;
  temp: any;
  list: any;
};

// ratio가 150아래로 떨어졌을때 대상자에 넣어주면됨
const initialState: LiquidState = {
  liquidation: false,
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
};

export const TransactionSlice = createSlice({
  name: "liquidation",
  initialState,
  reducers: {
    sample(state, actions: PayloadAction<LiquidState>) {
      state.liquidation = actions.payload.liquidation;
    },
    ratioAdd(state, actions: PayloadAction<LiquidState>) {
      state.temp = actions.payload.temp;
    },
  },
});

export const { sample, ratioAdd } = TransactionSlice.actions;

export default TransactionSlice.reducer;
