import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SUPPORTED_NETWORKS, SUPPORTED_NETWORKS_CONFIRM } from "lib/network";

export type WalletState = {
    address?: string;
    networkName?: string;
    networkId?: number;
    isConnect?: boolean;
    confirm?: number;
};

const initialState: WalletState = {
    address: null,
    networkName: null,
    networkId: Number(process.env.REACT_APP_DEFAULT_NETWORK_ID),
    isConnect: false,
    confirm: 12,
};

export const wallet = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        updateAddress(state, actions: PayloadAction<WalletState>) {
            return { ...state, address: actions.payload.address };
        },

        updateNetwork(state, actions: PayloadAction<WalletState>) {
            const networkId = actions.payload.networkId;
            let networkName = SUPPORTED_NETWORKS[networkId];
            if (networkName === "MAINNET") {
                networkName = "ETHEREUM";
            }
            const confirm = SUPPORTED_NETWORKS_CONFIRM[networkId];

			return { ...state, networkId, networkName, confirm };
        },

        updateIsConnect(state, actions: PayloadAction<boolean>) {
			return { ...state, isConnect: actions.payload};
        },

        clearWallet(state) {
			return { ...state, address: null, isConnect: false };
        },
    },
});

export const { updateAddress, updateNetwork, updateIsConnect, clearWallet } = wallet.actions;

export default wallet.reducer;
