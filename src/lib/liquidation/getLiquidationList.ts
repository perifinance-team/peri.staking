import { contracts } from "lib/contract";

import { setListReady, updateList } from "config/reducers/liquidation";

import { SUPPORTED_NETWORKS } from "lib/network";
import { formatCurrency } from "lib/format";

import { connectContract } from "./connectContract";

let liquidationList = [];

const sortList = (list) => {
	const open = [];
	const close = [];

	list.forEach((item) => ( item?.status === 0 ? open.push(item) : item?.status === 2 ? close.push(item) : null));
	console.log("open", open);
	const sortOpen = open
		.map((item) => item)
		.sort(
			(a, b) => Number(formatCurrency(a["cRatio"]).replaceAll(",", "")) - Number(formatCurrency(b["cRatio"]).replaceAll(",", ""))
		);

	return [...sortOpen, ...close];
};

export const getLiquidationList = async (dispatch, stakeTokens, networkId = 1287) => {
	// dispatch(setLoading({ name: "liquidation", value: true }));

	console.log("stakeTokens", stakeTokens);

	dispatch(setListReady(false));

	const query = `query {
    liquidationTargets(network: "${SUPPORTED_NETWORKS[networkId].toUpperCase()}") {
      address
    }
  }`;

	await fetch(process.env.REACT_APP_THEGRAPH_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query }),
	})
		.then((res) => res.json())
		.then((json) => (liquidationList = [...json.data.liquidationTargets]));

	const tempList = [];
	const len = liquidationList.length / 30;
	for (let i = 0; i < len; i++) {
		const partList = liquidationList.slice(i * 30, (i + 1) * 30); 
		await Promise.all(
			partList.map(async (address, idx) => {
				await connectContract(address.address, contracts, stakeTokens).then((data: object | boolean) => {
					if (data) {
						tempList.push(data);
					}
				});
			})
		);
	}

	// // todo : remove this when test is finished
	// tempList[0] = await connectContract('0x8143BF76Bcb7e6D32E17672fAe25be38c723E286', contracts, stakeTokens);

	// console.log("test list updating", tempList);

	// // todo : remove this when test is finished
	// dispatch(updateList(tempList));

	// // todo : uncomment this when test is finished
	if (len) dispatch(updateList(sortList(tempList)));
	else dispatch(updateList([]));
	
	return tempList;
	// dispatch(setLoading({ name: "liquidation", value: false }));
};
