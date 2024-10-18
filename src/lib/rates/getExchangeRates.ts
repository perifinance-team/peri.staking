import { contracts } from "lib/contract";
import { toBytes32 } from "lib/etc/utils";
import { natives } from "lib/rpcUrl/rpcUrl";

export const getExchangeRates = async (nativeCoin) => {
  const { ExchangeRates } = contracts as any;

  if (!ExchangeRates) {
    return {
      PERI: BigInt(0),
      USDC: BigInt(0),
      DAI: BigInt(0),
      USDT: BigInt(0),
      XAUT: BigInt(0),
      PAXG: BigInt(0),
    };
  }

  const keys = ["PERI", "USDC", "DAI"];

  if (contracts["XAUT"]) keys.push("XAUT");
  if (contracts["PAXG"]) keys.push("PAXG");
  if (contracts["USDT"]) keys.push("USDT");

  keys.push(nativeCoin);

  // console.log("keys", keys);
  // console.log("toBytes32", keys.map(toBytes32));

  const rates = await ExchangeRates.ratesForCurrencies(
    keys.map(toBytes32)
  ).then((values) => values.map((value) => BigInt(value)));

  const Obj:any = {};
  keys.forEach((key, index) => {
    if (key === nativeCoin) {
      Obj["NATIVE"] = rates[index];
    }
    else{
      Obj[key] = rates[index];
    }
  });

  // console.log("rates", PERI, USDC, DAI, XAUT, PAXG, USDT);
  // const [PERI, USDC, DAI, XAUT, PAXG, USDT] = rates.map(feed => feed.toBigInt());
  // console.log("Obj", Obj);

  return Obj;
};
