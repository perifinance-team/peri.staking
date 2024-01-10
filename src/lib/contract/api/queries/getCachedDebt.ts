export const getCachedDebt = ({ networkId }) => {
	return {
		url: "tvl",
		params: {
			networkId,
		},
		mapping: ({ data }) => {
			return {
				networkId: Number(networkId),
				debt: BigInt(data * 10 ** 18),
			};
		},
	};
};
