import { SUPPORTED_WALLETS } from '../index';
import { pynthetix } from 'lib/pynthetix';
import { WalletState } from 'config/reducers/wallet'

export const connectMetamask = async (networkId, networkName) => {
	let walletState: WalletState = {
		walletType: SUPPORTED_WALLETS.METAMASK,
		unlocked: false,
		networkId,
		networkName,
		currentWallet: undefined,
		unlockReason: undefined
	}
	try {
		const accounts = await pynthetix.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			walletState.currentWallet = accounts[0];
			walletState.unlocked = true;
		} else {
			walletState.unlockReason = 'Please connect to Metamask';
		}
		// We updateWalletStatus with all the infos
	} catch (e) {
		console.log(e);
		walletState.unlockReason = 'ErrorWhileConnectingToMetamask';
	}
	return walletState;
};