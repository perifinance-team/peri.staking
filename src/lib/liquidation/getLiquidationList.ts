import { contracts } from "lib/contract";
import axios from "axios";

import { setLoading } from "config/reducers/loading";
import { updateList } from "config/reducers/liquidation";

import { connectContract } from "./connectContract";

let liquidationList = ["0x0614629a7e46d5713f1a0784b7fd7f9c0540f3d6"];

export const getLiquidationList = async (dispatch, networkId = 1287) => {
	dispatch(setLoading({ name: "liquidation", value: true }));
	const { PeriFinance, Liquidations } = contracts as any;

	console.log("networkId", networkId);

	await axios
		.get(
			`https://perifinance1.com/api/v1/liquidationList?networkId=${networkId}`,
			{
				headers: { "Content-Type": "application/json", Authorization: "*" },
			}
		)
		.then((data) => {
			liquidationList = [...data.data];
		})
		.catch((e) => console.log("Liquidation API error", e));

	const tempList = [];

	await Promise.all(
		liquidationList.map(async (address, idx) => {
			await connectContract(address, PeriFinance, Liquidations, contracts).then(
				(data: object | boolean) => {
					data && tempList.push(data);
				}
			);
		})
	);

	console.log("tempList", tempList);
	dispatch(updateList(tempList));
	dispatch(setLoading({ name: "liquidation", value: false }));
};
