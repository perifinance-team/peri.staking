import { toWei } from "web3-utils";

import { base, baseSepolia } from "./networks/base";
import { bsc } from "./networks/bsc";
import { bsctest } from "./networks/bsctest";
import { mainnet, sepolia } from "./networks/mainnet";
import { moonbeam, moonriver, moonbase } from "./networks/moonbeam";
import { polygon, mumbai } from "./networks/polygon";

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
	1284: moonbeam,
	1285: moonriver,
	1287: moonbase,
	1337: polygon, // or 1337
	80001: mumbai,
	8453: base,
	84532: baseSepolia,
	11155111: sepolia,
};
export const getNetworkFee = async (networkId):Promise<bigint> => {
	const gasPrice = api[networkId] ? await (api[networkId])(networkId) : '10';

	const gasfee = (parseInt(gasPrice) > 1
		? Math.round(Number(gasPrice))
		: Math.round(Number(gasPrice) * 1e9) / 1e9
	).toString();

	console.log("gasfee", gasfee);
	
	return BigInt(toWei(gasfee ? gasfee : '10', 'gwei'));
};
