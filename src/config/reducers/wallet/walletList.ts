import { createSlice , PayloadAction} from '@reduxjs/toolkit';


export type WalletItem = {
    address: String,
    balances?: Object
}

export type WalletListState = {
	walletList: Array<WalletItem>
}


const initialState: WalletListState = {
	walletList: []
};

export const wallet = createSlice({
	name: 'wallet',
	initialState,
	reducers: {
		updateWalletList(state, action: PayloadAction<WalletListState>)  {
			state = {...action.payload};
		}
	},
});

export const {updateWalletList} = wallet.actions;

export default wallet.reducer;
