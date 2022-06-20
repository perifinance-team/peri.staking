import { contracts } from "lib/contract";
import { utils } from "ethers";
import { getBalance } from "lib/balance";
import axios from "axios";

import { setLoading } from "config/reducers/loading";
import { updateList } from "config/reducers/liquidation";
import { formatCurrency } from "lib/format";

// ! test
let liquidationList = [
  // "0x801Df07cc133a3473e45Add999bBbd7F77C8b6b7",
  // "0xd4489408c163DCB8Bc795AE78b87b6aFb731461e",
  // !
  "0x5694db44DDD389Ee42f199028a024713c80B5069",
  "0xBd6fAE3BDD65a9502B193f0bC172fe59dec435D3",
  "0xBE7dBcAE623559186912cc39cDE7479B7DAE6d06",
  "0x08365C15fDAAE8423ee63577FD144755D79C3733",
  "0xd4a8aD0D11B4F385A332e3D8533E96B84a1443e4",
  // ! 위에는 테스트 계정들

  // "0x08bcb4d98bc8af73b3d4e31e0e2de716c11c0e11",
  // "0x095fc820bf9bc4049742209f172de442c8471a0b",
  // "0x0adfaa939777d1abf70f220012daf69b32abf8ba",
  // "0x16a3c50f1ec275335cf2feaf96738de54c6ae9a2",
  // "0x1d034737bf536590f6efdf541b07b949fe209e96",
  // "0x20baaeb0507ed3d33a1b1c2822b337116fbee640",
  // "0x23c14e77e980e8d90851c72678ec5f4255af7874",
  // "0x2910a8c6a167953411ffb52c9480fd764283bb04",
  // "0x2986cc02c66561e266951771889e642231a1d081",
  // "0x300ff02ec5f686604c6ca38af152404e806f9909",
  // "0x333a340ac6bdb1db377eea7c71e6944cfb2b4c54",
  // "0x371c99290f391fab97a7ce54ccf07be313b9e254",
  // "0x416482822baa12600c5d2aed77c2308f7724e0ef",
  // "0x47eb29882d772d3e60ce3b948f0085178e5b5cce",
  // "0x4bb04bb8750996fece4b28c5f629c0db65c2222b",
  // "0x4c42e76d41360257868f8e5e8c7d85bd61d444b6",
  // "0x52a659aee22616beb4626c8b111b6d9c31461ca8",
  // "0x64338fe6aeee6efa0c13f0327469de2c764c28e2",
  // "0x6ff48ec953cec35aebe255970c27e86520359272",
  // "0x727839fd19978809b7e616092e2eb7b54034a4d7",
  // "0x7535397059bc8108a5721e2ab87dbb89896f979c",
  // "0x76f32b0032171d573cf87ce72cecd81224c58689",
  // "0x77626aa9db0bc3aadab4a10eb75f04cf048b8d1c",
  // "0x7dda763101fac37e81f57b3c031c67cd153f8f03",
  // "0x7eae1e0d58a8b1ead803e2857cc71262790bef31",
  // "0x8d6bd12d7c422ce5e25ec0995cafccf5bfed727c",
  // "0x8fe5b442c8f9aee0a117a10ff850db813e22274c",
  // "0x99b32a7aa5a353b42b92fa58d7f0d1b98b2d93d5",
  // "0x9f27a7399df501d401c671268533e9d79e2e04b5",
  // "0xaa92bf2867ddcc541be9398f7245ebc846b3d336",
  // "0xb85d4ca78bdc2dbe76abdfe75fd14412e708e7b7",
  // "0xb9f746df82439b1ed43ee1aae07b243b6e40fca5",
  // "0xbcc667dd9b984bfa6f8a65f3e07d341fbcfbd7da",
  // "0xc421a355648b66d3e872d6489ab202c7d0d139d1",
  // "0xc56993491eb1fa12c17863f922a8393de8ab4413",
  // "0xc9814aad78022b9abde25d035cd42f350c0e08e9",
  // "0xd1e0275183fed488966db140ce19281b5da76fc6",
  // "0xd3b2e540c790a37768e274a59e4b69a0076c9c80",
  // "0xd996eff75e43357f04e3f37d61ef6a6851a0b8f1",
  // "0xdd9be16bd424bef9efb1cbcc8201c6caf6f31492",
  // "0xe16b23059842d421a835c7a240f5f85869e0892a",
  // "0xeb01ff124d71b6c7e6613fd6e0a86c28c733f008",
  // "0xeb04ee956b3aa60977542e084e38c60be7fd69a5",
  // "0xf144fcebdb84fd3bc070108673d6290940aad756",
  // "0xfb7b45b6dea4c8df9f6e674dace6bffa276c2639",
];

const ratioToPer = (value) => {
  if (value === 0n) return "0";
  return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
};

const waitingFnc = async (
  address: string,
  PeriFinance: any,
  Liquidations: any,
  contracts: any
) => {
  const debt = BigInt(
    await PeriFinance.debtBalanceOf(address, utils.formatBytes32String("pUSD"))
  );

  const cRatio = BigInt(
    (await PeriFinance.collateralisationRatio(address)).toString()
  );

  const daiKey =
    "0x4441490000000000000000000000000000000000000000000000000000000000";
  const usdcKey =
    "0x5553444300000000000000000000000000000000000000000000000000000000";

  const collaterial = { pUSD: 0, USDC: 0, DAI: 0 };

  const tempPUSD = async () => {
    const staked =
      formatCurrency(await PeriFinance.collateral(address)).replace(",", "") -
      formatCurrency(
        await PeriFinance.transferablePeriFinance(address)
      ).replace(",", "");

    return Math.abs(staked);
  };

  const tempUSDC = async () => {
    return await contracts.ExternalTokenStakeManager.stakedAmountOf(
      address,
      usdcKey,
      usdcKey
    );
  };
  const tempDAI = async () => {
    return await contracts.ExternalTokenStakeManager.stakedAmountOf(
      address,
      daiKey,
      daiKey
    );
  };

  await tempPUSD().then((data) => (collaterial.pUSD = data));
  await tempUSDC().then((data) => (collaterial.USDC = data));
  await tempDAI().then((data) => (collaterial.DAI = data));

  // status
  const status = async () => {
    if (
      (await Liquidations.isOpenForLiquidation(address)) &&
      Number(ratioToPer(cRatio)) <= 150
    ) {
      return 0;
    } else if (false) {
      // todo taken
      return 1;
    } else {
      return 2;
    }
  };

  let resultData;

  await status().then((data) => (resultData = data));

  return {
    idx: "oxlx1y",
    cRatio: cRatio,
    debt: debt,
    collateral: [
      {
        name: "Peri",
        value: collaterial.pUSD,
      },
      { name: "Dai", value: collaterial.DAI },
      { name: "USDC", value: collaterial.USDC },
    ],
    status: resultData,
    address: address,
  };
};

export const getLiquidationList = async (dispatch, networkId) => {
  console.log("contracts", contracts);

  dispatch(setLoading({ name: "liquidation", value: true }));
  const { PeriFinance, Liquidations } = contracts as any;

  await axios
    .get(`https://perifinance1.com/api/v1/liquidationList?networkId=1287`, {
      headers: { "Content-Type": "application/json", Authorization: "*" },
    })
    .then((data) => (liquidationList = [...data.data]))
    .catch((e) => console.log("Liquidation API error", e));

  const tempList = [];

  for (let address of liquidationList) {
    await waitingFnc(address, PeriFinance, Liquidations, contracts).then(
      (data: object) => {
        tempList.push(data);
      }
    );
  }

  dispatch(updateList(tempList));
  dispatch(setLoading({ name: "liquidation", value: false }));
};
