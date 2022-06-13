import { updateTimestamp } from "config/reducers/liquidation";
import { contracts } from "lib/contract";

export const getTimeStamp = async (address, Liquidations) => {
  // const { Liquidations } = contracts as any;

  let test = false;

  let testAddress = [
    "0x8d6bd12d7c422ce5e25ec0995cafccf5bfed727c",
    "0x2910a8c6a167953411ffb52c9480fd764283bb04",
    "0x2986cc02c66561e266951771889e642231a1d081",
    "0x300ff02ec5f686604c6ca38af152404e806f9909",
    "0x333a340ac6bdb1db377eea7c71e6944cfb2b4c54",
    "0x371c99290f391fab97a7ce54ccf07be313b9e254",
    "0x416482822baa12600c5d2aed77c2308f7724e0ef",
    "0x47eb29882d772d3e60ce3b948f0085178e5b5cce",
    "0x4bb04bb8750996fece4b28c5f629c0db65c2222b",
  ];

  if (test) {
    let testStartTime = new Date();
    testStartTime.getTime();

    for (let i = 0; i < testAddress.length; i++) {
      await Liquidations.getLiquidationDeadlineForAccount(testAddress[i]).then(
        (data) => {
          console.log(Number(data.toString()));
        }
      );
    }
  } else {
    await Liquidations.getLiquidationDeadlineForAccount(
      test ? address : "0x095fc820bf9bc4049742209f172de442c8471a0b"
    ).then((data) => updateTimestamp(Number(data.toString())));
  }
};
