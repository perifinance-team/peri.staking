import { createSlice , PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import { connectHelper } from 'helpers/wallet/connect'
import { SUPPORTED_NETWORKS } from 'helpers/network/supportedNetWorks'

export type WalletState = {
	currentWallet?: string,
	networkId?: number,
	networkName?: string, 
	unlocked?: boolean,
	walletType?: string,
	unlockReason?: string,
}

const connectWallet = createAsyncThunk(
	`connectWallet`,
	async (walletType) => {
        return await connectHelper(walletType);
    }
);


const clearWalletState = () => { 
	return {
		currentWallet: undefined,
		networkId: 42,
		networkName: 'KOVAN',
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
			state.unlocked = false;
		},
		updateWallet(state, actions: PayloadAction<WalletState>) {
			state = Object.assign(state, {...actions.payload});
		},
		clearWallet(state) {
			state = Object.assign(state, clearWalletState());
		},
		updateWalletType(state, actions: PayloadAction<string>) {
			state.walletType = actions.payload;
		},
		updateWalletNetwork(state, actions: PayloadAction<number>) {
			state.networkId = actions.payload;
			state.networkName = SUPPORTED_NETWORKS[actions.payload].toUpperCase();
		}
	},
	extraReducers: {
		[connectWallet.fulfilled.type]: (state, actions: PayloadAction<WalletState>) => {
			state = Object.assign(state, {...actions.payload});
		}
	}
});

export const { initWallet, updateWallet, clearWallet, updateWalletType, updateWalletNetwork } = wallet.actions;

export default wallet.reducer;
