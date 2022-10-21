import { contracts } from "lib/contract";
import axios from "axios";

import { setLoading } from "config/reducers/loading";
import { updateList } from "config/reducers/liquidation";

import { connectContract } from "./connectContract";

let liquidationList = [];

const sortList = (list) => {
	const open = [];
	const close = [];

	list.forEach((item) => (item.status === 0 ? open.push(item) : close.push(item)));

	return [...open, ...close];
};

export const getLiquidationList = async (dispatch, networkId = 1287) => {
	dispatch(setLoading({ name: "liquidation", value: true }));
	const { PeriFinance, Liquidations } = contracts as any;

	// ! temp close
	// await axios
	// 	.get(`https://perifinance1.com/api/v1/liquidationList?networkId=${networkId}`, {
	// 		headers: { "Content-Type": "application/json", Authorization: "*" },
	// 	})
	// 	.then((data) => {
	// 		liquidationList = [...data.data];
	// 	})
	// 	.catch((e) => console.log("Liquidation API error", e));

	const query = `query {
    liquidationTargets(network: "polygon") {
      address
    }
  }`;

	await fetch("http://localhost:4000", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query }),
	})
		.then((res) => res.json())
		.then((json) => (liquidationList = [...json.data.liquidationTargets]));

	const tempList = [];

	await Promise.all(
		liquidationList.map(async (address, idx) => {
			await connectContract(address.address, PeriFinance, Liquidations, contracts).then((data: object | boolean) => {
				if (data) {
					tempList[idx] = data;
				}
			});
		})
	);

	dispatch(updateList(sortList(tempList)));
	dispatch(setLoading({ name: "liquidation", value: false }));
};
