import { contracts } from "lib/contract";
export const getLiquidationRatio = async () => {
  const { Liquidations } = contracts as any;

  const liquidationRatio = await Liquidations?.liquidationRatio();

  return BigInt(Liquidations ? liquidationRatio : 0.666666666666666666 * 1e17);
};
