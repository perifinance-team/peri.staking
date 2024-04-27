import { extractMessage } from "lib/error";
import { fromBytes32, toBigNumber } from "lib/etc/utils";

// const ratioToPer = (value) => {
// 	if (value === 0n) return "0";
// 	return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
// };

export const connectContract = async (address: string, contracts: any, stakeTokens: any) => {
  try {
    const { Liquidations, ExternalTokenStakeManager } = contracts as any;

    const [
      { tokenList, stakedAmts },
      { tRatio, cRatio, debt, exTRatio, exEA, periCol, isLiquidateOpen },
    ] = await Promise.all([
      ExternalTokenStakeManager.tokenStakeStatus(address),
      Liquidations.cRatioNDebtsCollateral(address),
    ]); /*. then((data) => {return data})
		.catch((e) => {
			console.error("connectContract ERROR:", e.data.message);
		}) */
    // const { tRatio, cRatio, debt, exTRatio, exEA, periCol, isLiquidateOpen } = ratioDebts;

    // console.log("periCol", periCol.toBigInt());
    if (debt.isZero()) {
      return false;
    }

    // const { tokenList, stakedAmts } = tokenStatus;

    // console.log("stakeTokens", stakeTokens);

    // const { tokenList, stakedAmts } = await ExternalTokenStakeManager.tokenStakeStatus(address);

    const tmpCollateral = [];
    tmpCollateral.push({ name: "PERI", value: periCol, IR: stakeTokens["PERI"].IR });
    let totalAmt = periCol;
    tokenList.forEach((item, idx) => {
      totalAmt += stakedAmts[idx];

    //   console.log("item", item, fromBytes32(item), stakeTokens[fromBytes32(item)]);

      const name = fromBytes32(item);
      const IR = stakeTokens[name]?.IR 
        ? stakeTokens[name].IR 
        : stakeTokens[name].stable 
          ? toBigNumber("1")
          : toBigNumber("0.75");

      // console.log(name, stakeTokens[name], totalAmt, stakeTokens);
      tmpCollateral.push({ name: name, value: stakedAmts[idx], IR });
    });

    // isLiquidateOpen && console.log("tmpCollateral", tmpCollateral, totalAmt, isLiquidateOpen);

    return {
      tRatio: tRatio.toBigInt(),
      cRatio: cRatio.toBigInt(),
      debt: debt.toBigInt(),
      exEA: exEA.toBigInt(),
      exTRatio: exTRatio.toBigInt(),
      collateral: tmpCollateral,
      status: isLiquidateOpen && totalAmt > 0 ? 0 : 2,
      address: address,
      totalEA: totalAmt,
      toggle: false,
    };
  } catch (err) {
    console.error("connectContract ERROR:", extractMessage(err));
    return {};
  }
};
