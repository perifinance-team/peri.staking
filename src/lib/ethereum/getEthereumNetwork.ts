import { getEthereumNetworkId } from 'lib/ethereum';
import { SUPPORTED_NETWORKS } from 'helpers/network';

export async function getEthereumNetwork() {
    let network = { networkName: 'KOVAN', networkId: '42' };
    try {
        let networkId = await getEthereumNetworkId();
        if(networkId) {
            network.networkName = SUPPORTED_NETWORKS[networkId];
            network.networkId = networkId;
        }
	} catch (e) {
		console.log(e);
	}
    return network;
}