import { pynthetix } from '../pynthetix'

import { getSignerConfig } from './getSignerConfig'

export const setSigner = (walletType, networkId) => {
	const signerConfig = getSignerConfig(walletType, networkId);
	const signer = new pynthetix.signers[walletType](signerConfig);
	pynthetix.setContractSettings({
		networkId,
		signer,
		provider: signer.provider,
	});
};

export default setSigner;