import { WalletState } from 'config/reducers/wallet'

export const connectHardwareWallet = (networkId, networkName, walletType) => {
	const walletState: WalletState = {
		walletType,
		unlocked: false,
		networkId,
		networkName: networkName.toLowerCase(),
		currentWallet: undefined,
		unlockReason: undefined
	}
	return walletState
};