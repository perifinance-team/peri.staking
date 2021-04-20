import { ethers } from 'ethers';

type EthereumProvider = {
	on: (event: string, cb: () => void) => void;
	isConnected: () => boolean;
	ethereum: ethers.providers.Provider | undefined;
	isMetaMask: boolean;
	netWorkVersion: string;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}
