import { utils } from "ethers";
export const getCirculatingSupply = () => {
	return {
		url: "circulatingSupply",
		params: {},
		mapping: ({ data }): bigint => {
			return utils.parseEther(data.toString()).toBigInt();
		},
	};
};
