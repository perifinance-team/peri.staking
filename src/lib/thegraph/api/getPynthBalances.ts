// import {balance} from "../queries";
// import {get} from "../service";

import pynths from "configure/coins/pynths";

import { contracts } from "lib/contract";

import { PynthBalance } from "../../../config/reducers/wallet/balances";

import { getLastRates } from "./getLastRates";

// export type PynthBalance = { currencyName: string; amount: bigint; usdBalance: bigint };
export const getPynthBalance = async (
  address: string,
  coinName: string,
  decimal: number = 18,
  list: boolean = false,
  rate: bigint = 0n
): Promise<bigint | PynthBalance> => {
  const balanceMapping = (data: bigint) => {
    let amount = 0n;
    try {
      amount = data;
    } catch (e) {
      amount = 0n;
    }

    return {
      currencyName: coinName,
      amount,
      usdBalance: coinName === "pUSD" ? amount : (amount * rate) / 10n ** 18n,
    };
  };

  // console.log("getPynthBalance", coinName, contracts[`ProxyERC20${coinName}`]);

  try {
    if (decimal === 18) {
      return contracts[`ProxyERC20${coinName}`] 
        ? list
          ? balanceMapping(
            BigInt((await contracts[`ProxyERC20${coinName}`].balanceOf(address)).toString())
            )
          : BigInt((await contracts[`ProxyERC20${coinName}`].balanceOf(address)).toString())
        : list 
          ? balanceMapping(0n)
          : 0n;
    } else {
      return contracts[`ProxyERC20${coinName}`] 
        ? list
          ? balanceMapping(
              BigInt((await contracts[`ProxyERC20${coinName}`].balanceOf(address)).toString()) *
                BigInt(Math.pow(10, 18 - decimal).toString())
            )
          : BigInt((await contracts[`ProxyERC20${coinName}`].balanceOf(address)).toString()) *
              BigInt(Math.pow(10, 18 - decimal).toString())
        : list 
          ? balanceMapping(0n)
          : 0n;
    }
  } catch (e) {
    console.error("getPynthBalance error", e);
  }
  return 0n;
};

export const getPynthBalances = async ({
  currencyName = undefined,
  networkId = undefined,
  address,
  rates = undefined,
}): Promise</* bigint |  */ PynthBalance[] | PynthBalance> => {
  try {
    if (currencyName) {
      return getPynthBalance(address, currencyName) as Promise<PynthBalance>;
    } else if (pynths[networkId]) {
      const promises = [];

      await Promise.all(
        pynths[networkId].map(async (pynth: any, idx: number) =>
          getLastRates([pynth.symbol]).then(
            async (rate) =>
              (promises[idx] = await getPynthBalance(
                address,
                pynth.symbol,
                18,
                true,
                rate ? rate[0].price : 0n
              ))
          )
        )
      );

      return promises;
    }
  } catch (e) {
    console.error("getPynthBalances ERROR:", e);
  }
};
