import { getProvider } from '../../helpers/provider'
import { SUPPORTED_WALLETS } from '../../helpers/wallet'
import { INFURA_URLS } from '../../helpers/infura'

// const PORTIS_APP_ID = '81b6e4b9-9f28-4cce-b41f-2de90c4f906f';

export const getSignerConfig = (type, networkId) => {
	const customProvider = getProvider(networkId);
	
	if (type === SUPPORTED_WALLETS.LEDGER) {
		const DEFAULT_LEDGER_DERIVATION_PATH = "44'/60'/";
		return {
			derivationPath: DEFAULT_LEDGER_DERIVATION_PATH,
			provider: customProvider,
		};
	}

	if (type === SUPPORTED_WALLETS.TREZOR) {
		return {
			provider: customProvider,
		};
	}

	if (type === SUPPORTED_WALLETS.COINBASE) {
		return {
			appName: 'pynths',
			appLogoUrl: `${window.location.origin}/images/pynths.png`,
			jsonRpcUrl: INFURA_URLS[networkId],
			networkId,
			provider: customProvider,
		};
	}
	
	return {
		provider: customProvider,
	};
};

export default getSignerConfig;