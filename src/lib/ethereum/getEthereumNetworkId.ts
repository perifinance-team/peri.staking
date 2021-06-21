import detectEthereumProvider from '@metamask/detect-provider';

export async function getEthereumNetworkId() {
	// @ts-ignore
	let { networkVersion } = await detectEthereumProvider();
 	return networkVersion;
}
