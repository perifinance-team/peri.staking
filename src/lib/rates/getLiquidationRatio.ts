import { contracts } from "lib/contract";
export const getLiquidationRatio = async () => {
  const { Liquidations } = contracts as any;

  return BigInt((await Liquidations.liquidationRatio()).toString());
};
