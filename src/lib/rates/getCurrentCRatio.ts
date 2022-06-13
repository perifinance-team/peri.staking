import { contracts } from "lib/contract";

export const getCurrentCRatio = async (currentWallet) => {
  const { PeriFinance } = contracts as any;

  if (currentWallet) {
    try {
      return BigInt(
        (await PeriFinance.collateralisationRatio(currentWallet)).toString()
      );
    } catch (e) {
      return BigInt(0);
    }
  } else {
    return BigInt(0);
  }
};
