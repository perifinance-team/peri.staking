import { getEthereumNetworkId } from 'lib/ethereum';
import { SUPPORTED_NETWORKS } from 'helpers/network';
type Wallet = {
    networkName?: String,
    networkId?: String
}
export async function getEthereumNetwork() {
    const wallet: Wallet = JSON.parse(window.localStorage.getItem('wallet'));
    let network;
    try {
        let networkId = await getEthereumNetworkId();
        if(networkId) {
            network = {
                networkName: SUPPORTED_NETWORKS[networkId],
                networkId: networkId
            };
        } else {
            network = { 
                networkName: wallet.networkName,
                networkId: wallet.networkId
            };
        }
	} catch (e) {
		console.log(e);
	}
    return network;
}