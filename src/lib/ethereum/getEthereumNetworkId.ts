const defaultNetwork = 1;

export function getEthereumNetworkId() {
	const networkVersion: number = Number(window.ethereum?.netWorkVersion) || defaultNetwork;
	return networkVersion;
}
