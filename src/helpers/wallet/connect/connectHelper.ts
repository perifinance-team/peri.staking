import { setSigner } from 'lib/signer'
import { getEthereumNetwork } from 'lib/ethereum'
import { SUPPORTED_WALLETS } from '../index';
import { USDC } from 'lib'

import {
	connectMetamask,
	connectCoinbase,
	connectHardwareWallet,
} from '../connect'

const connect = async (walletType, networkName, networkId) => {
	switch (walletType) {
		case SUPPORTED_WALLETS.METAMASK:
			return connectMetamask(networkId, networkName);
		case SUPPORTED_WALLETS.COINBASE:
			return connectCoinbase(networkId, networkName);
		case SUPPORTED_WALLETS.TREZOR:
		case SUPPORTED_WALLETS.LEDGER:
			return connectHardwareWallet(networkId, networkName, walletType);
		// case SUPPORTED_WALLETS.WALLET_CONNECT:
		// 	return connectWallet(networkId, networkName);
		// case SUPPORTED_WALLETS.PORTIS:
		// 	return connectPortis(networkId, networkName);
		default:
			return {
				networkId,
				walletType: undefined,
				unlocked: false,
				unlockReason: 'NetworkNotSupported',
				networkName,
				currentWallet: undefined
			};
	}
}
export const connectHelper = async (walletType) => {
	const { networkName, networkId } = await getEthereumNetwork();
	
	const { signer } = setSigner(walletType, networkId);
	
	const walletStatus = await connect(walletType, networkName, networkId);
	await USDC.connect(signer, networkId);

	return walletStatus;
};