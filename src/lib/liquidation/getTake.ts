import { utils } from "ethers";

import { setLoading } from "config/reducers/loading";
import { updateTransaction } from "config/reducers/transaction";

import { toBigInt } from "lib/etc/utils";

export const getTake = async (
  value: string,
  id: number,
  address: string,
  list: any,
  dispatch: any,
  contracts: any,
  balance: any,
  toggleModal: any
) => {
  console.log("getTake", value, id, address, list, dispatch, contracts, balance, toggleModal);
  dispatch(setLoading({ name: "balance", value: true }));

  if (!value) return;

  if (address === list[id].address) {
    if (balance.pUSD.transferable < toBigInt(value.replaceAll(",", ""))) return;

    await getState(toBigInt(value.replaceAll(",", "")), id, contracts, list, dispatch, toggleModal);
  }
  await toggleModal(id);
  dispatch(setLoading({ name: "balance", value: false }));
};

const getState = async (
  pUSD: any,
  id: number,
  contracts: any,
  list: any,
  dispatch: any,
  toggleModal: any
) => {
  try {
    const transaction = await contracts.signers.PeriFinance.liquidateDelinquentAccount(
      list[id].address,
      pUSD
    );
    dispatch(
      updateTransaction({
        hash: transaction.hash,
        message: `Get take`,
        type: "Get take",
      })
    );
  } catch (e) {
    console.error("take ERROR:", e);
  }
};
