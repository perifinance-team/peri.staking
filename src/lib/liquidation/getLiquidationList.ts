import { contracts } from "lib/contract";
import axios from "axios";

import { setLoading } from "config/reducers/loading";
import { updateList } from "config/reducers/liquidation";

import { connectContract } from "./connectContract";

let liquidationList = [
  "0x5694db44DDD389Ee42f199028a024713c80B5069",
  "0xBd6fAE3BDD65a9502B193f0bC172fe59dec435D3",
  "0xBE7dBcAE623559186912cc39cDE7479B7DAE6d06",
  "0x08365C15fDAAE8423ee63577FD144755D79C3733",
  "0xd4a8aD0D11B4F385A332e3D8533E96B84a1443e4",
];

const connectHandler = async (
  PeriFinance: any,
  Liquidations: any,
  dispatch: any,
  liquidationList: string[],
  contracts: any
) => {
  const tempList = [];

  // ? 비동기 병렬화 promise.all
  try {
    await Promise.allSettled(
      liquidationList.map(async (address, idx) => {
        return await connectContract(
          address,
          PeriFinance,
          Liquidations,
          contracts
        )
          .then((data: object) => {
            tempList[idx] = data;
          })
          .catch((e) => console.log("promise.all error", e));
      })
    );

    dispatch(updateList(tempList));
  } catch (e) {
    console.error("promise error", e);
  }
};

export const getLiquidationList = async (dispatch, networkId = 1287) => {
  console.time("liquidation");

  dispatch(setLoading({ name: "liquidation", value: true }));
  const { PeriFinance, Liquidations } = contracts as any;

  await axios
    .get(
      `https://perifinance1.com/api/v1/liquidationList?networkId=${networkId}`,
      {
        headers: { "Content-Type": "application/json", Authorization: "*" },
      }
    )
    .then((data) => {
      liquidationList = [...liquidationList, ...data.data];
    }) // ! test 배열 합쳐놨음
    .catch((e) => console.log("Liquidation API error", e));

  // await connectHandler(
  //   PeriFinance,
  //   Liquidations,
  //   dispatch,
  //   liquidationList,
  //   contracts
  // );

  const tempList = [];

  // ? 비동기 병렬화 promise.all
  // ! contract에서 networdId 관련 에러가 나는 것 같음

  console.log("run?");
  await Promise.allSettled(
    liquidationList.map(async (address, idx) => {
      const connect = await connectContract(
        address,
        PeriFinance,
        Liquidations,
        contracts
      );

      // (data: object) => {
      //   tempList[idx] = data;
      // }

      console.log(connect);
    })
  );

  // for (let address of liquidationList) {
  //   await connectContract(address, PeriFinance, Liquidations, contracts).then(
  //     (data: object) => {
  //       tempList.push(data);
  //     }
  //   );
  // }

  dispatch(updateList(tempList));
  dispatch(setLoading({ name: "liquidation", value: false }));

  console.timeEnd("liquidation");
};
