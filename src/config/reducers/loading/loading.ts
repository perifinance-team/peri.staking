import { createSlice } from "@reduxjs/toolkit";

export type Loading = {
    loadings: object;
};

const initialState: Loading = {
    loadings: {
        balance: false,
        apy: false,
        burnAble: false,
        gasEstimate: false,
        closeCurrentFeePeriod: false,
        rewardData: false,
        vestingData: false,
        amountsToFitClaimable: false,
        liquidation: false,
        escrow: false,
        take: false,
    },
};

export const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoading: (state, actions) => {
            const loadings = { ...state.loadings };
            loadings[actions.payload.name] = actions.payload.value;
            return { ...state, loadings: loadings };
        },
    },
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
