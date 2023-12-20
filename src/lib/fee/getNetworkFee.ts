import { mainnet } from "./networks/mainnet";
import { bsc } from "./networks/bsc";
import { bsctest } from "./networks/bsctest";
import { polygon } from "./networks/polygon";
import { moonriver } from "./networks/moonriver";

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
	1285: moonriver,
	1287: moonriver,
	1337: polygon, // or 1337
	80001: polygon,
};
export const getNetworkFee = async (networkId):Promise<bigint> => {
	const gwei = 1000000000n;
	const gasfee = api[networkId] ? await (api[networkId])() : 10n * gwei;

	console.log("gasfee", gasfee);
	
	return BigInt((gasfee ? gasfee : 10n) * gwei);
};
