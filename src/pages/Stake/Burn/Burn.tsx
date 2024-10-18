import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import { NotificationManager } from "react-notifications";
import { addSeconds, differenceInSeconds } from "date-fns";

import { H1 } from "components/heading";
import { BurnCard } from "components/card/BurnCard";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Mousewheel, Virtual } from "swiper/core";
import { contracts } from "lib/contract";
import { formatCurrency } from "lib";
import { utils, } from "ethers";
import { updateTransaction } from "config/reducers/transaction";
import { setLoading } from "config/reducers/loading";
import { web3Onboard } from "lib/onboard";
import { StakeContainer, Container, Title } from "../Mint/Mint";
import { divideDecimal, fromBigInt, multiplyDecimal, toBigInt, toBytes32 } from "lib/etc/utils";
import { end, start } from "lib/etc/performance";

SwiperCore.use([Mousewheel, Virtual]);

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

const secondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${str_pad_left(minutes, "0", 2)}m`;
  } else if (minutes > 0) {
    return `${str_pad_left(minutes, "0", 2)} mins`;
  }
  return `up to 1 minute`;
};

// const currencies = [
//   { name: "USDC", isExternal: true, isLP: false },
//   { name: "DAI", isExternal: true, isLP: false },
//   { name: "PERI", isExternal: false, isLP: false },
// ];

// contracts["USDT"] && currencies.push({ name: "USDT", isExternal: true, isLP: false });
// contracts["XAUT"] && currencies.push({ name: "XAUT", isExternal: true, isLP: false });
// contracts["PAXG"] && currencies.push({ name: "PAXG", isExternal: true, isLP: false });
// contracts["LP"] && currencies.push({ name: "LP", isExternal: false, isLP: true });

const Burn = ({ currencies }) => {
  const dispatch = useDispatch();
  const { hash } = useSelector((state: RootState) => state.transaction);
  const { balances } = useSelector((state: RootState) => state.balances);
  const balancesIsReady = useSelector((state: RootState) => state.balances.isReady);
  const exchangeIsReady = useSelector((state: RootState) => state.exchangeRates.isReady);
  const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
  const { maxStakingRatio } = useSelector((state: RootState) => state.ratio);
  const { isConnect, address, networkId } = useSelector((state: RootState) => state.wallet);
  const { gasPrice } = useSelector((state: RootState) => state.networkFee);
  const [issuanceDelay, setIssuanceDelay] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeCurrency, setActiveCurrency] = useState(null);
  // const [ init, setInit ] = useState(false);
  const [unStakeAmount, setUnStakeAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [maxUnStakeAmount, setMaxUnStakeAmount] = useState("");
  const [maxBurnAmount, setMaxBurnAmount] = useState("");

  const [cRatio, setCRatio] = useState(0n);

  const onChangeBurnAmount = (value, currencyName) => {
    if (/\./g.test(value)) {
      value = value.match(/\d+\.\d{0,17}/g);
      value = value ? value[0] : "";
    }

    // console.log("value", value);

    if (isNaN(Number(value)) || value === "") {
      setUnStakeAmount("");
      setBurnAmount("");

      return false;
    }
    try {
      let burnAmount;
      let unStakeAmt;

      if (currencyName === "LP") {
        unStakeAmt = value;
        if (toBigInt(maxUnStakeAmount) <= toBigInt(unStakeAmt)) {
          unStakeAmt = maxUnStakeAmount;
        }

        setUnStakeAmount(unStakeAmt);
      } else {
        burnAmount = value;
        const bnBurnAmount = toBigInt(burnAmount);

        // console.log("maxBurnAmount", maxBurnAmount, "burnAmount", burnAmount);

        if (toBigInt(maxBurnAmount) <= toBigInt(burnAmount)) {
          burnAmount = maxBurnAmount;
          unStakeAmt = maxUnStakeAmount;
        } else {
          const toSARatio = multiplyDecimal(balances[currencyName].IR, exchangeRates[currencyName]);
          unStakeAmt =
            toSARatio > 0n
              ? divideDecimal(
                  bnBurnAmount,
                  multiplyDecimal(balances[currencyName].IR, exchangeRates[currencyName])
                )
              : 0n;
          /* (BigInt(utils.parseEther(burnAmount).toString()) *
              BigInt(Math.pow(10, 18).toString()) *
              (BigInt(Math.pow(10, 18).toString()) / targetCRatio)) /
            exchangeRates[currencyName]; */
          unStakeAmt = fromBigInt(unStakeAmt);
          // console.log("unStakeAmt", unStakeAmt, "burnAmount", burnAmount);
        }

        if (currencyName !== "LP") {
          getCRatio(currencyName, burnAmount, unStakeAmt);
        }
        // unStakeAmount =
        //   BigInt(utils.parseEther(unStakeAmount).toString())/*  + PERIQuota */;

        // if (unStakeAmount < 0n) {
        //   unStakeAmount = "";
        // } else {
        //   unStakeAmount = utils.formatEther(unStakeAmount);
        // }
        unStakeAmt = Number(unStakeAmt).toFixed(balances[currencyName].decimal);
        // console.log("unStakeAmount", unStakeAmount, "burnAmount", burnAmount);

        if (
          currencyName === "PERI" &&
          balances["DEBT"].balance !== 0n &&
          Number(burnAmount) === 0
        ) {
          if (balances["pUSD"].balance === 0n) {
            NotificationManager.warning(
              `Please burn other pynths or buy $pUSD at Uniswap`,
              "Not Enough pUSD"
            );
          } else {
            NotificationManager.warning(
              `Please check the unstaking order ($Others ➔ $PERI)`,
              "Unstake Order"
            );
          }
        } else if (balances["DEBT"].balance === 0n && Number(burnAmount) === 0) {
          NotificationManager.warning(`There is no debt to burn`, "No debt");
        } else if (balances[currencyName].staked === 0n && Number(unStakeAmt) === 0) {
          NotificationManager.warning(`There is no ${currencyName} to unstake`, "No staked");
        }

        setUnStakeAmount(unStakeAmt);
        setBurnAmount(burnAmount);
      }
    } catch (e) {
      if (currencyName !== "LP") {
        getCRatio(currencyName, "0", "0");
      }
      setUnStakeAmount("");
      setBurnAmount("");
    }
  };

  const getMaxAmount = (currency) => {
    let burnAmount = 0n;
    let unStakeAmt = 0n;

    if (currency.isLP) {
      burnAmount = 0n;
      unStakeAmt = balances["LP"].staked;
    } else {
      if (currency.isExternal) {
        burnAmount = balances["DEBT"][currency.name];

        if (burnAmount > balances["pUSD"].transferable) {
          burnAmount = balances["pUSD"].transferable;
        }

        // unStakeAmount = balances[currency.name].staked;
      } else {
        console.log(currency.name, "balances[currency.name].IR", balances[currency.name].IR);
        const periSA = divideDecimal(balances["DEBT"].PERI, balances[currency.name].IR);
        console.log("periSA", periSA);
        const exEA = balances[currency.name].totalEA - periSA;
        const minPeriSA =
          maxStakingRatio > 0n
            ? multiplyDecimal(exEA, divideDecimal(toBigInt(1) - maxStakingRatio, maxStakingRatio))
            : 0n;
        const minPeriDebt = multiplyDecimal(minPeriSA, balances[currency.name].IR);

        burnAmount = balances["DEBT"].PERI - minPeriDebt;
        burnAmount = burnAmount < 0n ? 0n : burnAmount;

        if (burnAmount > balances["pUSD"].transferable) {
          burnAmount = balances["pUSD"].transferable;
        }

        // divideDecimal(burnAmount, multiplyDecimal(balances["PERI"].IR, exchangeRates["PERI"]));
        /*  (burnAmount *
            (BigInt(Math.pow(10, 18).toString()) / targetCRatio) *
            BigInt(Math.pow(10, 18).toString())) /
          exchangeRates["PERI"]; */
      }
      const toSARatio = multiplyDecimal(balances[currency.name].IR, exchangeRates[currency.name]);
      unStakeAmt =
        toSARatio > 0n
          ? divideDecimal(
              burnAmount,
              multiplyDecimal(balances[currency.name].IR, exchangeRates[currency.name])
            )
          : 0n;

      unStakeAmt =
        unStakeAmt > balances[currency.name].staked
          ? balances[currency.name].staked
          : unStakeAmt;
    }

    console.log(
      "burnAmount",
      burnAmount,
      "unStakeAmount",
      unStakeAmt,
      "staked",
      balances[currency.name].staked
    );

    setMaxBurnAmount(fromBigInt(burnAmount));
    setMaxUnStakeAmount(fromBigInt(unStakeAmt));
  };

  const connectHelp = async () => {
    NotificationManager.error(`Please connect your wallet first`, "ERROR");
    try {
      await web3Onboard.connect();
    } catch (e) {}
  };

  const getGasEstimate = async (currency) => {
    let gasLimit = 600000n;
    dispatch(setLoading({ name: "gasEstimate", value: true }));
    if (currency.name === "LP") {
      try {
        gasLimit = BigInt(
          (
            await contracts.signers.LP.contract.estimateGas.withdraw(
              utils.parseEther(unStakeAmount)
            )
          ).toString()
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        gasLimit = BigInt(
          (
            await contracts.signers.PeriFinance.estimateGas.burnPynths(
              utils.formatBytes32String(activeCurrency.name),
              utils.parseEther(burnAmount)
            )
          ).toString()
        );
      } catch (e) {
        console.log(e);
      }
    }
    dispatch(setLoading({ name: "gasEstimate", value: false }));

    return ((gasLimit * 12n) / 10n).toString();
  };

  const burnAction = async (currency) => {
    if (!isConnect) {
      await connectHelp();
      return false;
    }

    const transactionSettings = {
      gasPrice: gasPrice.toString(),
      gasLimit: await getGasEstimate(currency),
    };
    let transaction;
    if (currency.name === "LP") {
      if (toBigInt(unStakeAmount) === 0n) {
        NotificationManager.warning(`Please enter amount to Unstake`, "Warning");
        return false;
      }

      try {
        transaction = await contracts.signers.LP.withdraw(
          utils.parseEther(unStakeAmount),
          transactionSettings
        );
        dispatch(
          updateTransaction({
            hash: transaction.hash,
            message: `${activeCurrency.name} unStake ${formatCurrency(
              BigInt(utils.parseEther(unStakeAmount).toString())
            )} LP`,
            type: "UnStake",
          })
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      if (issuanceDelay > 0) {
        NotificationManager.warning(
          `There is a waiting period after minting before you can burn. Please wait
                    ${secondsToTime(issuanceDelay)} before attempting to burn pUSD.`,
          "NOTE",
          0
        );
        return false;
      }

      if (toBigInt(burnAmount) === 0n) {
        NotificationManager.warning(`Please enter the pUSD to Burn`, "ERROR");
        return false;
      }

      try {
        transaction = await contracts.signers.PeriFinance.burnPynths(
          toBytes32(activeCurrency.name),
          toBigInt(burnAmount),
          transactionSettings
        );
        dispatch(
          updateTransaction({
            hash: transaction.hash,
            message: `${activeCurrency.name} Burn ${formatCurrency(toBigInt(burnAmount))} pUSD`,
            type: "Burn",
          })
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getCRatio = (currencyName, burnAmount, unStakeAmount) => {
    if (burnAmount === "" || !burnAmount) {
      burnAmount = "0";
    }

    try {
      /*let burnAmountToPERI =
        (BigInt(utils.parseEther(burnAmount).toString()) *
          BigInt(Math.pow(10, 18).toString())) /
        exchangeRates["PERI"];

      let totalDEBT =
        (balances["DEBT"].balance * BigInt(Math.pow(10, 18).toString())) /
          exchangeRates["PERI"] -
        burnAmountToPERI;

      const USDCTotalStake =
        currencyName === "USDC"
          ? balances["USDC"].staked -
            BigInt(utils.parseEther(unStakeAmount).toString())
          : balances["USDC"].staked;
      const USDCStakedToPERI =
        (USDCTotalStake * exchangeRates["USDC"]) / exchangeRates["PERI"];

      const DAITotalStake =
        currencyName === "DAI"
          ? balances["DAI"].staked -
            BigInt(utils.parseEther(unStakeAmount).toString())
          : balances["DAI"].staked;
      const DAIStakedToPERI =
        (DAITotalStake * exchangeRates["DAI"]) / exchangeRates["PERI"];

      setCRatio(
        (BigInt(Math.pow(10, 18).toString()) * 100n) /
          ((totalDEBT * BigInt(Math.pow(10, 18).toString())) /
            (balances["PERI"].balance + DAIStakedToPERI + USDCStakedToPERI))
      ); */

      const bnBurnAmount = utils.parseEther(burnAmount).toBigInt();
      const bnBurnSA = 0n;
        // balances[currencyName].IR > 0n
        //   ? divideDecimal(bnBurnAmount, balances[currencyName].IR)
        //   : 0n;
      const estDebt = balances["DEBT"].balance - bnBurnAmount;
      const estTotalEA = balances["PERI"].totalEA - bnBurnSA;
      // console.log("debt", balances["DEBT"].balance, "totalEA", balances["PERI"].totalEA);
      // console.log("C-Ratio", balances["DEBT"].balance > 0n ? divideDecimal(divideDecimal(balances["PERI"].totalEA, balances["DEBT"].balance), BigInt(1e16)) : 0n);
      // console.log("bnBurnAmount", bnBurnAmount, "bnBurnSA", bnBurnSA);
      // console.log("estTotalEA", estTotalEA, "estDebt", estDebt);

      const cRatio =
        estDebt > 0n ? divideDecimal(divideDecimal(estTotalEA, estDebt), BigInt(1e16)) : 0n;
      // const cRatio = Number(fromBigInt(tmpRatio)).toFixed(2)
      // console.log("cRatio", cRatio);
      setCRatio(cRatio);
    } catch (e) {
      setCRatio(0n);
    }
  };

  const getIssuanceDelayCheck = async () => {
    start("burnAble");
    dispatch(setLoading({ name: "burnAble", value: true }));

    const [canBurnPynths, lastIssueEvent, minimumStakeTime] = await Promise.all([
      contracts.Issuer.canBurnPynths(address),
      contracts.Issuer.lastIssueEvent(address),
      contracts.SystemSettings.minimumStakeTime(),
    ]);
    // const canBurnPynths = await contracts.Issuer.canBurnPynths(address);
    // const lastIssueEvent = await contracts.Issuer.lastIssueEvent(address);
    // const minimumStakeTime = await contracts.SystemSettings.minimumStakeTime();

    console.log(
      "canBurnPynths",
      canBurnPynths,
      "lastIssueEvent",
      lastIssueEvent.toBigInt(),
      "minimumStakeTime",
      minimumStakeTime.toBigInt()
    );

    if (Number(lastIssueEvent) && Number(minimumStakeTime)) {
      const burnUnlockDate = addSeconds(Number(lastIssueEvent) * 1000, Number(minimumStakeTime));
      const issuanceDelayInSeconds = differenceInSeconds(burnUnlockDate, new Date());
      setIssuanceDelay(issuanceDelayInSeconds > 0 ? issuanceDelayInSeconds : canBurnPynths ? 0 : 1);
      const issuanceDelay =
        issuanceDelayInSeconds > 0 ? issuanceDelayInSeconds : canBurnPynths ? 0 : 1;

      if (issuanceDelay > 0) {
        NotificationManager.warning(
          `There is a waiting period after minting before you can burn. Please wait
                    ${secondsToTime(issuanceDelay)} before attempting to burn pUSD.`,
          "NOTE",
          0
        );
      }
      dispatch(setLoading({ name: "burnAble", value: false }));
      end();
      return issuanceDelay;
    } else {
      end();
      dispatch(setLoading({ name: "burnAble", value: false }));
      return 1;
    }
  };

  useEffect(() => {
    if (!hash) {
      setUnStakeAmount("");
      setBurnAmount("");
      getCRatio(currencies[slideIndex].name, "0", "0");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balancesIsReady, exchangeIsReady, isConnect, slideIndex]);

  useEffect(() => {
    if (balancesIsReady && exchangeIsReady) {
      if (isConnect) {
        getMaxAmount(currencies[slideIndex]);
        getIssuanceDelayCheck();
        if (currencies[slideIndex].isLP) {
          setCRatio(0n);
          setUnStakeAmount("");
        } else {
          setUnStakeAmount("");
          setBurnAmount("");
          getCRatio(currencies[slideIndex].name, burnAmount, unStakeAmount);
        }
      } else {
        setCRatio(0n);
        setMaxUnStakeAmount("");
        setMaxBurnAmount("");
      }
    }
  }, [exchangeIsReady, balancesIsReady, exchangeRates, balances, isConnect]);

  useEffect(() => {
    if (slideIndex !== null) {
      setActiveCurrency(currencies[slideIndex]);
      setUnStakeAmount("");
      setBurnAmount("");
      getCRatio(currencies[slideIndex].name, "0", "0");
    }
  }, [slideIndex]);

  useEffect(() => {
    if (slideIndex !== null && exchangeIsReady && balancesIsReady) {
      getMaxAmount(currencies[slideIndex]);
    }
  }, [slideIndex, exchangeIsReady, balancesIsReady]);

  return (
    <Container>
      <Title $show={slideIndex === 0}>
        <H1>BURN</H1>
      </Title>
      <BurnContainer>
        <Swiper
          spaceBetween={0}
          direction={"vertical"}
          slidesPerView={contracts["LP"] ? 7 : 6}
          centeredSlides={true}
          mousewheel={true}
          allowTouchMove={true}
          breakpoints={{
            "1023": {
              allowTouchMove: false,
            },
          }}
          onSlideChange={({ activeIndex }) => setSlideIndex(activeIndex)}
          virtual
        >
          {currencies.map((currency, index) => {
            // console.log("currency", currency);
            return (
              <SwiperSlide key={currency.name} virtualIndex={index}>
                <BurnCard
                  hide={index < slideIndex}
                  isActive={index === slideIndex}
                  currencyName={currency.name}
                  maxAction={() =>
                    isConnect
                      ? onChangeBurnAmount(
                          currency.isLP ? maxUnStakeAmount : maxBurnAmount,
                          currency.name
                        )
                      : connectHelp()
                  }
                  unStakeAmount={unStakeAmount}
                  burnAmount={burnAmount}
                  cRatio={cRatio}
                  onChange={onChangeBurnAmount}
                  isLP={currency.isLP}
                  burnAction={() => burnAction(currency)}
                  staked={balances[currency.name]?.staked}
                  decimals={balances[currency.name]?.decimal}
                  isConnect={isConnect}
                  isReady={balancesIsReady}
                  networkId={networkId}
                ></BurnCard>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </BurnContainer>
    </Container>
  );
};

const BurnContainer = styled(StakeContainer)`
  .swiper-wrapper {
    top: -13.5% !important;
  }

  .swiper-slide.swiper-slide-next {
    margin-top: 3% !important;
  }

  ${({ theme }) => theme.media.mobile`
    .swiper-wrapper {
      top: -2.5% !important;
    }

    .swiper-slide.swiper-slide-next  {
      margin-top: 5% !important;
    }

  `}
`;

export default Burn;
