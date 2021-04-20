import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IsConnectedWallet = {
    isConnectedWallet: boolean
}

const initialState: IsConnectedWallet = {
    isConnectedWallet: false
}


export const isConnectedWallet = createSlice({
	name: 'isConnectedWallet',
	initialState,
	reducers: {
		updateIsConnected(state, actions: PayloadAction<boolean>)  {
            state.isConnectedWallet = actions.payload
		},
	},
});

export const { updateIsConnected } = isConnectedWallet.actions;

export default isConnectedWallet.reducer;
