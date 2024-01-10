export const getAPY = () => {
	return {
		url: "apy",
		params: {},
		mapping: ({ data }) => {
			return Number(data).toFixed(2);
		},
	};
};
