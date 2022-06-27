import { setLoading } from "config/reducers/loading";
import { formatCurrency } from "lib/format";

const daiKey =
  "0x4441490000000000000000000000000000000000000000000000000000000000";
const usdcKey =
  "0x5553444300000000000000000000000000000000000000000000000000000000";

const getCollateral = async (contracts, tempAddress, template, PeriFinance) => {
  console.log("perifīnance", PeriFinance);
  const pUSD =
    BigInt(await PeriFinance.collateral(tempAddress)) -
    BigInt(await PeriFinance.transferablePeriFinance(tempAddress));

  console.log("pUSD", pUSD);

  template.collateral.Peri = pUSD / 10n ** 18n;

  const usdc = await contracts.ExternalTokenStakeManager.stakedAmountOf(
    tempAddress,
    usdcKey,
    usdcKey
  );

  template.collateral.USDC = BigInt(usdc) / 10n ** 18n;

  const dai = await contracts.ExternalTokenStakeManager.stakedAmountOf(
    tempAddress,
    daiKey,
    daiKey
  );

  template.collateral.Dai = BigInt(dai) / 10n ** 18n;
};

export const getEscrowList = async (contracts, dispatch, PeriFinance) => {
  dispatch(setLoading({ name: "liquidation", value: true }));

  console.log("dddd", PeriFinance);

  const escrowList = [];

  // todo need to escrow tempAddress list

  console.log("PeriFinanceEscrow", await contracts.PeriFinanceEscrow);

  // ? 보상으로 받아 Escrow 되어 있는 PERI 잔액 조회
  // console.log(contracts.RewardEscrowV2.balanceOf);

  const addressList = [1, 2];

  for (const address of addressList) {
    console.log(`${address}번 돌았음`);

    let tempAddress = "0x8143BF76Bcb7e6D32E17672fAe25be38c723E286"; // todo 지울거

    // todo error biding
    const template = {
      idx: "",
      collateral: { Peri: 0, Dai: 0, USDC: 0 },
      time: 0,
    };

    try {
      await getCollateral(contracts, tempAddress, template, PeriFinance);

      console.log("getCollateral", template);
    } catch (e) {}

    try {
      // template.time = await PeriFinanceEscrow.TIME_INDEX();
    } catch (e) {
      console.log("Get Escrow time error", e);
    }

    await escrowList.push(template);
  }

  dispatch(setLoading({ name: "liquidation", value: false }));

  return escrowList;
};
