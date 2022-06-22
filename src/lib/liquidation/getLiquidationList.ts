import { contracts } from "lib/contract";
import axios from "axios";

import { setLoading } from "config/reducers/loading";
import { updateList } from "config/reducers/liquidation";

import { connectContract } from "./connectContract";

let liquidationList = [];

export const getLiquidationList = async (dispatch, networkId) => {
  dispatch(setLoading({ name: "liquidation", value: true }));
  const { PeriFinance, Liquidations } = contracts as any;

  await axios
    .get(
      `https://perifinance1.com/api/v1/liquidationList?networkId=${networkId}`,
      {
        headers: { "Content-Type": "application/json", Authorization: "*" },
      }
    )
    .then((data) => (liquidationList = [...data.data]))
    .catch((e) => console.log("Liquidation API error", e));

  const tempList = [];

  for (let address of liquidationList) {
    await connectContract(address, PeriFinance, Liquidations, contracts).then(
      (data: object) => {
        tempList.push(data);
      }
    );
  }

  dispatch(updateList(tempList));
  dispatch(setLoading({ name: "liquidation", value: false }));
};
