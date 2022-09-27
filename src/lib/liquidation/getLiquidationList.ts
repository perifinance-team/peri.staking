import { contracts } from "lib/contract";
import axios from "axios";
import { gql } from "@apollo/client";
import { client } from "./apollo";

import { setLoading } from "config/reducers/loading";
import { updateList } from "config/reducers/liquidation";

import { connectContract } from "./connectContract";

let liquidationList = [];

const sortList = (list) => {
	const open = [];
	const close = [];

	list.forEach((item) =>
		item.status === 0 ? open.push(item) : close.push(item)
	);

	return [...open, ...close];
};

export const getLiquidationList = async (dispatch, networkId = 1287) => {
	dispatch(setLoading({ name: "liquidation", value: true }));
	const { PeriFinance, Liquidations } = contracts as any;

	await client.query({
		query: gql`
			query {
				liquidationTargets(network: "${networkId}") {
					address
					network
				}
			}
		`
	})
	.then((data) => {
		liquidationList = [...data.data.liquidationTargets];
	})
	.catch((e) => console.error("Liquidation API error", e));
		// .get(
		// 	`https://perifinance1.com/api/v1/liquidationList?networkId=${networkId}`,
		// 	{
		// 		headers: { "Content-Type": "application/json", Authorization: "*" },
		// 	}
		// )
		// .then((data) => {
		// 	liquidationList = [...data.data];
		// })
		// .catch((e) => console.log("Liquidation API error", e));

	const tempList = [];

	await Promise.all(
		liquidationList.map(async (address, idx) => {
			await connectContract(address, PeriFinance, Liquidations, contracts).then(
				(data: object | boolean) => {
					if (data) {
						tempList[idx] = data;
					}
				}
			);
		})
	);

	dispatch(updateList(sortList(tempList)));
	dispatch(setLoading({ name: "liquidation", value: false }));
};
