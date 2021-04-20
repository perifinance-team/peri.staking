import { createSlice , PayloadAction} from '@reduxjs/toolkit';

export type WalletState = {
	currentWallet?: string,
	networkId?: number,
	networkName?: string, 
	unlocked?: boolean,
	walletType?: string,
	unlockReason?: string,
}

const clearWalletState = () => { 
	return {
		currentWallet: undefined,
		networkId: 1,
		networkName: undefined,
		unlocked: false,
		walletType: undefined,
		unlockReason: undefined,
	}
}

const initialState: WalletState = clearWalletState();


export const wallet = createSlice({
	name: 'wallet',
	initialState,
	reducers: {
		initWallet(state) {
			state.unlockReason = undefined;
		},
		updateWallet(state, actions: PayloadAction<WalletState>)  {
			state = Object.assign(state, {...actions.payload});
		},
		clearWallet(state) {
			state = Object.assign(state, clearWalletState());
		},
	},
});

export const { initWallet, updateWallet, clearWallet } = wallet.actions;

export default wallet.reducer;
