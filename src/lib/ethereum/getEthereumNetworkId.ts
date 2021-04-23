import detectEthereumProvider from '@metamask/detect-provider';

export async function getEthereumNetworkId() {
	let { networkVersion } = (await detectEthereumProvider());
 	return networkVersion;
}
