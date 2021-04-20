import { providers } from 'ethers';
import { INFURA_ID } from '../infura';
type Network_names = {
    1: string;
    3: string;
    4: string;
    5: string;
    42: string;
}

const NETWORK_NAMES: Network_names = {
	1: 'HOMESTEAD',
	3: 'ROPSTEN',
	4: 'RINKEBY',
	5: 'GOERLI',
	42: 'KOVAN',
};

export const getProvider = (networkId: number) => {
	return new providers.InfuraProvider(NETWORK_NAMES[networkId].toLowerCase(), INFURA_ID)
};