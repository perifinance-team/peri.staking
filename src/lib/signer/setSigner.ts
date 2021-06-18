import { pynthetix } from '../pynthetix'
import { getSignerConfig } from './getSignerConfig'

export const setSigner = (walletType, networkId) => {
	const signerConfig = getSignerConfig(walletType, networkId);
	console.log(signerConfig);
	const signer = new pynthetix.signers[walletType](signerConfig);
	console.log(signer);
	return (pynthetix.setContractSettings({
		networkId,
		signer,
		provider: signer.provider,
	}));
	
};

export default setSigner;