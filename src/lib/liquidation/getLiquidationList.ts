import { contracts } from "lib/contract";
import { utils } from "ethers";
import { getBalance } from "lib/balance";
import axios from "axios";
import { setLoading } from "config/reducers/loading";
import { updateList } from "config/reducers/liquidation";

// ! temp
let liquidationList = [
  "0x8143BF76Bcb7e6D32E17672fAe25be38c723E286", // 실제 유저
  "0x52A659AEE22616BeB4626C8b111B6D9C31461CA8", // 실제 유저
  "0x08bcb4d98bc8af73b3d4e31e0e2de716c11c0e11",
  "0x095fc820bf9bc4049742209f172de442c8471a0b",
  "0x0adfaa939777d1abf70f220012daf69b32abf8ba",
  "0x16a3c50f1ec275335cf2feaf96738de54c6ae9a2",
  "0x1d034737bf536590f6efdf541b07b949fe209e96",
  "0x20baaeb0507ed3d33a1b1c2822b337116fbee640",
  "0x23c14e77e980e8d90851c72678ec5f4255af7874",
  "0x2910a8c6a167953411ffb52c9480fd764283bb04",
  "0x2986cc02c66561e266951771889e642231a1d081",
  "0x300ff02ec5f686604c6ca38af152404e806f9909",
  "0x333a340ac6bdb1db377eea7c71e6944cfb2b4c54",
  "0x371c99290f391fab97a7ce54ccf07be313b9e254",
  "0x416482822baa12600c5d2aed77c2308f7724e0ef",
  "0x47eb29882d772d3e60ce3b948f0085178e5b5cce",
  "0x4bb04bb8750996fece4b28c5f629c0db65c2222b",
  "0x4c42e76d41360257868f8e5e8c7d85bd61d444b6",
  "0x52a659aee22616beb4626c8b111b6d9c31461ca8",
  "0x64338fe6aeee6efa0c13f0327469de2c764c28e2",
  "0x6ff48ec953cec35aebe255970c27e86520359272",
  "0x727839fd19978809b7e616092e2eb7b54034a4d7",
  "0x7535397059bc8108a5721e2ab87dbb89896f979c",
  "0x76f32b0032171d573cf87ce72cecd81224c58689",
  "0x77626aa9db0bc3aadab4a10eb75f04cf048b8d1c",
  "0x7dda763101fac37e81f57b3c031c67cd153f8f03",
  "0x7eae1e0d58a8b1ead803e2857cc71262790bef31",
  "0x8d6bd12d7c422ce5e25ec0995cafccf5bfed727c",
  "0x8fe5b442c8f9aee0a117a10ff850db813e22274c",
  "0x99b32a7aa5a353b42b92fa58d7f0d1b98b2d93d5",
  "0x9f27a7399df501d401c671268533e9d79e2e04b5",
  "0xaa92bf2867ddcc541be9398f7245ebc846b3d336",
  "0xb85d4ca78bdc2dbe76abdfe75fd14412e708e7b7",
  "0xb9f746df82439b1ed43ee1aae07b243b6e40fca5",
  "0xbcc667dd9b984bfa6f8a65f3e07d341fbcfbd7da",
  "0xc421a355648b66d3e872d6489ab202c7d0d139d1",
  "0xc56993491eb1fa12c17863f922a8393de8ab4413",
  "0xc9814aad78022b9abde25d035cd42f350c0e08e9",
  "0xd1e0275183fed488966db140ce19281b5da76fc6",
  "0xd3b2e540c790a37768e274a59e4b69a0076c9c80",
  "0xd996eff75e43357f04e3f37d61ef6a6851a0b8f1",
  "0xdd9be16bd424bef9efb1cbcc8201c6caf6f31492",
  "0xe16b23059842d421a835c7a240f5f85869e0892a",
  "0xeb01ff124d71b6c7e6613fd6e0a86c28c733f008",
  "0xeb04ee956b3aa60977542e084e38c60be7fd69a5",
  "0xf144fcebdb84fd3bc070108673d6290940aad756",
  "0xfb7b45b6dea4c8df9f6e674dace6bffa276c2639",
];

console.log(contracts);

let coinName = [
  { name: "PynthpUSD", amount: 18 },
  { name: "DAI", amount: 18 },
  { name: "USDC", amount: 18 },
];

const ratioToPer = (value) => {
  if (value === 0n) return "0";
  return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
};

const waitingFnc = async (
  address: string,
  PeriFinance: any,
  Liquidations: any
) => {
  // debt
  const debt = BigInt(
    await PeriFinance.debtBalanceOf(address, utils.formatBytes32String("pUSD"))
  );

  // current ratio
  const cRatio = BigInt(
    (await PeriFinance.collateralisationRatio(address)).toString()
  );

  // collaterial
  const pUSD = await getBalance(address, "PynthpUSD", coinName[0].amount);
  const USDC = await getBalance(address, "USDC", coinName[1].amount);
  const DAI = await getBalance(address, "DAI", coinName[2].amount);

  // status
  const status = async () => {
    if (
      (await Liquidations.isOpenForLiquidation(address)) &&
      Number(ratioToPer(cRatio)) < 150
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
    cRatio: cRatio ?? BigInt(0),
    debt: debt ?? BigInt(0),
    collateral: [
      { name: "Peri", value: pUSD ?? BigInt(0) },
      { name: "Dai", value: DAI ?? BigInt(0) },
      { name: "USDC", value: USDC ?? BigInt(0) },
    ],
    status: resultData,
  };
};

export const getLiquidationList = async (dispatch, networkId) => {
  console.log("contracts 로직단", contracts);

  dispatch(setLoading({ name: "liquidation", value: true }));
  const { PeriFinance, Liquidations } = contracts as any;

  // await axios
  //   .get(`https://perifinance1.com/api/v1/liquidationList?networkId=1287`, {
  //     headers: { "Content-Type": "application/json", Authorization: "*" },
  //   })
  //   .then((data) => (liquidationList = [...data.data]))
  //   .catch((e) => console.log("Liquidation API error", e));

  const tempList = [];

  for (let address of liquidationList) {
    await waitingFnc(address, PeriFinance, Liquidations).then(
      (data: object) => {
        tempList.push(data);
      }
    );
  }

  dispatch(updateList(tempList));
  dispatch(setLoading({ name: "liquidation", value: false }));
};
