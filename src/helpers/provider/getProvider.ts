import { providers } from 'ethers';
import { INFURA_URLS } from '../infura';

type Network_names = {
    1: string;
    3: string;
    4: string;
    5: string;
    42: string;
	80001: string;
}

const NETWORK_NAMES: Network_names = {
	1: 'HOMESTEAD',
	3: 'ROPSTEN',
	4: 'RINKEBY',
	5: 'GOERLI',
	42: 'KOVAN',
	80001: 'mumbai'
};

export const getProvider = (networkId: string) => {

	return new providers.JsonRpcProvider(INFURA_URLS[networkId]);
};