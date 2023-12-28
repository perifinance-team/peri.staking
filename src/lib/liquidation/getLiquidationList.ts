import { contracts } from "lib/contract";

import { setLoading } from "config/reducers/loading";
import { setListReady, updateList } from "config/reducers/liquidation";

import { SUPPORTED_NETWORKS } from "lib/network";
import { formatCurrency } from "lib/format";

import { connectContract } from "./connectContract";
import { te } from "date-fns/locale";

let liquidationList = [];

const sortList = (list) => {
	const open = [];
	const close = [];

	list.forEach((item) => (item.status === 0 ? open.push(item) : close.push(item)));
	console.log("open", open);
	const sortOpen = open
		.map((item) => item)
		.sort(
			(a, b) => Number(formatCurrency(a["cRatio"]).replaceAll(",", "")) - Number(formatCurrency(b["cRatio"]).replaceAll(",", ""))
		);

	return [...sortOpen, ...close];
};

export const getLiquidationList = async (dispatch, networkId = 1287) => {
	// dispatch(setLoading({ name: "liquidation", value: true }));

	dispatch(setListReady(false));
	const { PeriFinance, Liquidations } = contracts as any;

	const query = `query {
    liquidationTargets(network: "${SUPPORTED_NETWORKS[networkId].toUpperCase()}") {
      address
    }
  }`;

	await fetch(true ? "https://dex-api.peri.finance/" : "http://localhost:4000", {
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
				await connectContract(address.address, PeriFinance, Liquidations, contracts).then((data: object | boolean) => {
					if (data) {
						tempList.push(data);
					}
				});
			})
		);
	}

	// console.log("tempList", tempList);
	if (len) dispatch(updateList(sortList(tempList)));
	else dispatch(updateList([]));
	
	return tempList;
	// dispatch(setLoading({ name: "liquidation", value: false }));
};
