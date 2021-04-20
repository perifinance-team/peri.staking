import { SUPPORTED_WALLETS } from '../index';
import { pynthetix } from 'lib/pynthetix';
import { WalletState } from 'config/reducers/wallet'

export const connectPortis = async (networkId, networkName) => {
	let walletState: WalletState = {
		walletType: SUPPORTED_WALLETS.METAMASK,
		unlocked: false,
		networkId,
		networkName,
		currentWallet: undefined,
		unlockReason: undefined
	};
	try {
		const accounts = await pynthetix.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			walletState.currentWallet = accounts[0];
			walletState.unlocked = true;
		}
	} catch (e) {
		console.log(e);
		walletState.unlockReason = 'ErrorWhileConnectingToMetamask';
	}
	return walletState;
};