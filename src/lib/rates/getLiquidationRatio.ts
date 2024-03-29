import { contracts } from "lib/contract";
export const getLiquidationRatio = async (currentWallet) => {
  const { Liquidations } = contracts as any;

  const liquidationRatio = await Liquidations?.liquidationRatio(currentWallet);

  return BigInt(Liquidations ? liquidationRatio : 0.666666666666666666 * 1e17);
};
