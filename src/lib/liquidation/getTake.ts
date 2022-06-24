import { utils } from "ethers";
import { setLoading } from "config/reducers/loading";

export const getTake = async (
  id: number,
  address: string,
  list: any,
  dispatch: any,
  contracts: any
) => {
  if (address !== list[id].address) {
    dispatch(setLoading({ name: "liquidation", value: true }));

    const collateral = {
      Peri: BigInt(
        (
          await contracts.ExchangeRates.rateForCurrency(
            utils.formatBytes32String("PERI")
          )
        ).toString()
      ),
      USDC: BigInt(
        (
          await contracts.ExchangeRates.rateForCurrency(
            utils.formatBytes32String("USDC")
          )
        ).toString()
      ),
      Dai: BigInt(
        (
          await contracts.ExchangeRates.rateForCurrency(
            utils.formatBytes32String("DAI")
          )
        ).toString()
      ),
    };

    const peri =
      (BigInt(list[id].collateral[0].value.stake) * BigInt(collateral.Peri)) /
      10n ** 18n;
    const dai =
      (BigInt(list[id].collateral[1].value) * BigInt(collateral.Dai)) /
      10n ** 18n;
    const usdc =
      (BigInt(list[id].collateral[2].value) * BigInt(collateral.USDC)) /
      10n ** 18n;

    const sumCollateral = peri + dai + usdc;

    getState(sumCollateral, id, contracts, list, dispatch);
  }
};

const getState = async (sumCollateral, id, contracts, list, dispatch) => {
  try {
    const transaction =
      await contracts.signers.PeriFinance.liquidateDelinquentAccount(
        list[id].address,
        BigInt(sumCollateral)
      );

    await contracts.provider.once(transaction.hash, (state) => {
      if (state.status === 1) {
        dispatch(setLoading({ name: "liquidation", value: false }));
      }
    });
  } catch (e) {
    console.log("take err", e);
    dispatch(setLoading({ name: "liquidation", value: false }));
  }
};
