import { getEthereumNetworkId } from 'lib/ethereum';
import { SUPPORTED_NETWORKS } from 'helpers/network';

export async function getEthereumNetwork() {
    let network = { networkName: 'MAINNET', networkId: 1 };
    try {
        let networkId = getEthereumNetworkId();
        network.networkName = SUPPORTED_NETWORKS[networkId];
        network.networkId = networkId;
	} catch (e) {
		console.log(e);
	}
    return network;
}