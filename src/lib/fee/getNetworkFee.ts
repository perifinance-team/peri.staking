import { mainnet } from "./networks/mainnet";
import { bsc } from "./networks/bsc";
import { bsctest } from "./networks/bsctest";
import { polygon } from "./networks/polygon";

// ! temp gasstation
export const localhost = async () => {
	return BigInt(10n);
};

const api = {
	1: mainnet,
	3: mainnet,
	4: mainnet,
	5: mainnet,
	42: mainnet,
	56: bsc,
	97: bsctest,
	137: polygon,
	1285: polygon,
	1287: polygon,
	1337: localhost, // 31337
	80001: polygon,
};
export const getNetworkFee = async (networkId) => {
	const gasfee = await api[networkId]();
	return gasfee * 1000000000n;
};
