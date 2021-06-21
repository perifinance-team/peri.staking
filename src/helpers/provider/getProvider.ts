import { providers } from 'ethers';
import { INFURA_URLS } from '../infura';

export const getProvider = (networkId: string) => {
	return new providers.JsonRpcProvider(INFURA_URLS[networkId]);
}
