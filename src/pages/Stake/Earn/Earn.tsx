import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";
import { NotificationManager } from "react-notifications";

import { H1 } from "components/heading";
import { EarnCard } from "components/card/EarnCard";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Mousewheel, Virtual } from "swiper/core";
import { BigNumber, utils } from "ethers";
import { updateBalance } from "config/reducers/wallet";
import { updateTransaction } from "config/reducers/transaction";
import { contracts } from "lib/contract";
import { web3Onboard } from "lib/onboard";
import { getExchangeRatesLP } from "lib/rates";
import { getLpRewards } from "lib/reward";
import { setLoading } from "config/reducers/loading";
import { Title, Container, StakeContainer } from "../Mint/Mint";
import { toBigInt } from "lib/etc/utils";

SwiperCore.use([Mousewheel, Virtual]);
const Earn = ({ LPs }) => {
  const dispatch = useDispatch();
  const balancesIsReady = useSelector((state: RootState) => state.balances.isReady);
  const exchangeIsReady = useSelector((state: RootState) => state.exchangeRates.isReady);
  const { hash } = useSelector((state: RootState) => state.transaction);
  const [slideIndex, setSlideIndex] = useState(0);
  const { balances } = useSelector((state: RootState) => state.balances);
  const { networkId } = useSelector((state: RootState) => state.wallet);
  const { isConnect } = useSelector((state: RootState) => state.wallet);
  const { gasPrice } = useSelector((state: RootState) => state.networkFee);
  const [stakeAmount, setStakeAmount] = useState("0");
  const [maxStakeAmount, setMaxStakeAmount] = useState("0");
  const [isApprove, setIsApprove] = useState(false);
  const [rewardsAmountToAPY, setRewardsAmountToAPY] = useState(0n);

  // const coins = [{ name: "LP", isExternal: false, isLP: true }];

  const onChangeStakingAmount = (value, currencyName) => {
    if (/\./g.test(value)) {
      value = value.match(/\d+\.\d{0,17}/g)[0];
    }

    if (isNaN(Number(value)) || value === "") {
      setStakeAmount("0");
      return false;
    }
    let stakeAmount = value;
    const bnStakeAmount = toBigInt(stakeAmount);

    if (toBigInt(maxStakeAmount) < bnStakeAmount) {
      stakeAmount = maxStakeAmount;
    }

    if (bnStakeAmount > balances[currencyName].allowance) {
      setIsApprove(true);
    }

    setStakeAmount(stakeAmount);
  };

  const approveAction = async (currencyName) => {
    const amount = BigInt("11579208923731619542357098500868790785326998466");
    const transaction = await contracts[currencyName].approve();
    NotificationManager.info("Approve", "In progress", 0);

    const getState = async () => {
      await contracts.provider.once(transaction.hash, async (transactionState) => {
        if (transactionState.status === 1) {
          NotificationManager.remove(NotificationManager.listNotify[0]);
          NotificationManager.success(`Approve success`, "SUCCESS");
          dispatch(updateBalance({ currencyName, value: "allowance", amount }));
          setIsApprove(false);
        }
      });
    };
    getState();
  };

  const connectHelp = async () => {
    NotificationManager.error(`Please connect your wallet first`, "ERROR");
    try {
      await web3Onboard.connect();
    } catch (e) {}
  };

  const getAPY = async () => {
    dispatch(setLoading({ name: "apy", value: true }));
    try {
      const [exchangeRatesLP, lpRewards, totalStakeAmount] = await Promise.all([
        getExchangeRatesLP(networkId),
        getLpRewards(),
        contracts["LP"] ? contracts["LP"].totalStakeAmount() : BigNumber.from(0),
      ]);
      const { PERIBalance, PoolTotal } = exchangeRatesLP; /* await getExchangeRatesLP(networkId);
      const lpRewards = await getLpRewards();
      const totalStakeAmount = BigInt((await contracts["LP"].totalStakeAmount()).toString()); */

      const reward = lpRewards[networkId]
        ? (BigInt(lpRewards[networkId]) * BigInt(Math.pow(10, 18).toString()) * 52n * 100n) /
          ((totalStakeAmount.toBigInt() * PERIBalance) / PoolTotal)
        : 0n;

      setRewardsAmountToAPY(reward);
      setStakeAmount("0");
    } catch (e) {
      console.log(e);
      setRewardsAmountToAPY(0n);
    }
    dispatch(setLoading({ name: "apy", value: false }));
  };

  const getGasEstimate = async () => {
    let gasLimit = 600000n;
    dispatch(setLoading({ name: "gasEstimate", value: true }));
    try {
      gasLimit = BigInt(
        await contracts.signers.LP.contract.estimateGas.stake(utils.parseEther(stakeAmount))
      );
    } catch (e) {
      console.log(e);
    }
    dispatch(setLoading({ name: "gasEstimate", value: false }));
    return ((gasLimit * 12n) / 10n).toString();
  };

  const stakeAction = async () => {
    if (!isConnect) {
      await connectHelp();
      return false;
    }

    if (BigInt(utils.parseEther(stakeAmount).toString()) === 0n) {
      NotificationManager.error(`Please enter the LP to staking`, "ERROR");
      return false;
    }

    const transactionSettings = {
      gasPrice: gasPrice.toString(),
      gasLimit: await getGasEstimate(),
    };

    try {
      let transaction;
      transaction = await contracts.signers.LP.stake(
        utils.parseEther(stakeAmount),
        transactionSettings
      );

      dispatch(
        updateTransaction({
          hash: transaction.hash,
          message: `Stake ${stakeAmount} LP TOKEN`,
          type: "Stake LP",
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   if (!hash) {
  //     setStakeAmount("0");
  //   }
  // }, [hash]);

  useEffect(() => {
    setIsApprove(false);
    setStakeAmount("0");
  }, [isConnect]);

  useEffect(() => {
    if (slideIndex !== null) {
      setIsApprove(false);
      setStakeAmount("0");
    }
  }, [slideIndex]);

  useEffect(() => {
    if (balancesIsReady && exchangeIsReady) {
      getAPY();
      if (isConnect) {
        setMaxStakeAmount(
          utils.formatEther(balances[LPs[slideIndex].name].transferable.toString())
        );
      }
    }
  }, [exchangeIsReady, balancesIsReady, balances, isConnect]);

  useEffect(() => {
    if (slideIndex !== null && exchangeIsReady && balancesIsReady) {
      setMaxStakeAmount(utils.formatEther(balances[LPs[slideIndex].name].transferable.toString()));
    }
  }, [slideIndex, exchangeIsReady, balancesIsReady]);

  return (
    <Container>
      <Title $show={slideIndex === 0}>
        <H1>EARN</H1>
      </Title>
      <StakeContainer>
        <Swiper
          spaceBetween={5}
          direction={"vertical"}
          slidesPerView={4}
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
          {LPs?.map((coin, index) => (
            <SwiperSlide key={coin.name} virtualIndex={index}>
              <EarnCard
                isActive={index === slideIndex}
                coinName={coin.name}
                onChange={onChangeStakingAmount}
                apy={rewardsAmountToAPY}
                stakeAmount={stakeAmount}
                maxAction={() =>
                  isConnect ? onChangeStakingAmount(maxStakeAmount, coin.name) : connectHelp()
                }
                isApprove={isApprove}
                approveAction={() => approveAction(coin.name)}
                stakeAction={() => stakeAction()}
              ></EarnCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </StakeContainer>
    </Container>
  );
};

export default Earn;
