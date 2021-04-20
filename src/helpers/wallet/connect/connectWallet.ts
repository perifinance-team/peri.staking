import { SUPPORTED_WALLETS } from '../index';
import { pynthetix } from 'lib/pynthetix';
import { WalletState } from 'config/reducers/wallet'

export const connectWallet = async (networkId, networkName) => {
	const walletState: WalletState = {
		walletType: SUPPORTED_WALLETS.METAMASK,
		unlocked: false,
		networkId,
		networkName,
		currentWallet: undefined,
		unlockReason: undefined
	};
	try {
		await pynthetix.signer.provider._web3Provider.enable();
		
		const accounts = await pynthetix.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			walletState.currentWallet = accounts[0];
			walletState.unlocked = true;
		} else {
			walletState.unlockReason = 'Please connect to Wallet';
		}
	} catch (e) {
		console.log(e);
		walletState.unlockReason = 'ErrorWhileConnectingToWalletConnect';
	}
	return walletState
};