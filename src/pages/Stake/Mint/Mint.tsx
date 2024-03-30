import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import { NotificationManager } from "react-notifications";

import { H1 } from "components/heading";
import { MintCard } from "components/card/MintCard";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Mousewheel, Virtual } from "swiper/core";
import { utils } from "ethers";
import { contracts } from "lib/contract";
import { formatCurrency } from "lib";
import { updateBalance } from "config/reducers/wallet";
import { updateTransaction } from "config/reducers/transaction";
import { setLoading } from "config/reducers/loading";
import { web3Onboard } from "lib/onboard";

import { getTotalDebtCache } from "lib/balance";
import { getLpRewards } from "lib/reward";
import { getTotalAPY } from "lib/contract/api/api";

SwiperCore.use([Mousewheel, Virtual]);

const currencies = [
  { name: "USDC", isStable: true },
  { name: "PERI", isStable: false },
  { name: "DAI", isStable: true },
];

const Mint = () => {
  const dispatch = useDispatch();
  const balancesIsReady = useSelector((state: RootState) => state.balances.isReady);
  const exchangeIsReady = useSelector((state: RootState) => state.exchangeRates.isReady);
  const { balances } = useSelector((state: RootState) => state.balances);
  const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
  const { targetCRatio } = useSelector((state: RootState) => state.ratio);
  const { hash } = useSelector((state: RootState) => state.transaction);
  const { gasPrice } = useSelector((state: RootState) => state.networkFee);

  const { isConnect, networkId } = useSelector((state: RootState) => state.wallet);
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeCurrency, setActiveCurrency] = useState(null);
  const [maxStakeAmount, setMaxStakeAmount] = useState("0");
  const [maxMintAmount, setMaxMintAmount] = useState("0");
  const [mintAmount, setMintAmount] = useState("0");
  const [stakeAmount, setStakeAmount] = useState("0");
  const [isApprove, setIsApprove] = useState(false);
  const [rewardsAmountToAPY, setRewardsAmountToAPY] = useState(0n);
  const [cRatio, setCRatio] = useState(0n);

  const onChangeMintAmount = (value, currencyName) => {
    if (/\./g.test(value)) {
      value = value.match(/\d+\.\d{0,17}/g)[0];
    }

    if (isNaN(Number(value)) || value === "") {
      setMintAmount("");
      setStakeAmount("");
      return false;
    }

    try {
      let mintAmount = value;
      let stakeAmount;

      if (
        BigInt(utils.parseEther(maxMintAmount).toString()) <=
        BigInt(utils.parseEther(mintAmount).toString())
      ) {
        mintAmount = maxMintAmount;
        stakeAmount = maxStakeAmount;
      } else {
        stakeAmount =
          (BigInt(utils.parseEther(mintAmount).toString()) *
            BigInt(Math.pow(10, 18).toString()) *
            (BigInt(Math.pow(10, 18).toString()) / targetCRatio)) /
          exchangeRates[currencyName];
        stakeAmount = utils.formatEther(stakeAmount.toString());
      }

      if (currencyName !== "PERI") {
        if (BigInt(utils.parseEther(mintAmount).toString()) > balances[currencyName].allowance) {
          setIsApprove(true);
        }
      }
      getCRatio(currencyName, mintAmount, stakeAmount);

      setMintAmount(mintAmount);
      setStakeAmount(stakeAmount);
    } catch (e) {
      console.log(e);
      getCRatio(currencyName, "0", "0");
      setMintAmount("");
      setStakeAmount("");
    }
  };

  const getMaxAmount = async (currency) => {
    let stakeAmount = utils.formatEther(balances[currency.name].stakeable);
    let mintAmount = utils.formatEther(
      (BigInt(balances[currency.name].stakeable) * exchangeRates[currency.name]) /
        BigInt(Math.pow(10, 18).toString()) /
        (BigInt(Math.pow(10, 18).toString()) / targetCRatio)
    );

    // console.log(currency.name, balances[currency.name].stakeable);

    setMaxStakeAmount(stakeAmount);
    setMaxMintAmount(mintAmount);
  };

  const getGasEstimate = async () => {
    let gasLimit = 600000n;
    dispatch(setLoading({ name: "gasEstimate", value: true }));
    try {
      gasLimit = BigInt(
        (
          await contracts.signers.PeriFinance.estimateGas.issuePynths(
            utils.formatBytes32String(activeCurrency.name),
            utils.parseEther(mintAmount)
          )
        ).toString()
      );
    } catch (e) {
      console.log(e);
    }
    dispatch(setLoading({ name: "gasEstimate", value: false }));
    return ((gasLimit * 12n) / 10n).toString();
  };

  const approveAction = async (currencyName) => {
    const amount = BigInt("11579208923731619542357098500868790785326998466");
    const transaction = await contracts.signers[currencyName].approve(
      contracts?.addressList["ExternalTokenStakeManager"].address,
      amount.toString()
    );
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
    NotificationManager.warn(`Please connect your wallet first`, "ERROR");
    try {
      await web3Onboard.connect();
    } catch (e) {}
  };

  const mintAction = async () => {
    if (!isConnect) {
      await connectHelp();
      return false;
    }

    if (BigInt(utils.parseEther(mintAmount).toString()) === 0n) {
      NotificationManager.error(`Please enter the pUSD to mint`, "ERROR");
      return false;
    }

    const transactionSettings = {
      gasPrice: gasPrice.toString(),
      gasLimit: await getGasEstimate(),
    };

    try {
      let transaction;
      transaction = await contracts.signers.PeriFinance.issuePynths(
        utils.formatBytes32String(activeCurrency.name),
        utils.parseEther(mintAmount),
        transactionSettings
      );

      dispatch(
        updateTransaction({
          hash: transaction.hash,
          message: `${activeCurrency.name} Staking & Minting ${formatCurrency(
            BigInt(utils.parseEther(mintAmount).toString())
          )} pUSD`,
          type: "Staked & Minted",
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getAPY = async () => {
    // dispatch(setLoading({ name: "apy", value: true }));
    try {
      /* const totalMintpUSD = await getTotalDebtCache();
      const totalLpMint = await getLpRewards();

      let reward = 76924n * BigInt(Math.pow(10, 18).toString());

      reward =
        ((reward - totalLpMint["total"]) * exchangeRates["PERI"] * 52n * 100n) /
        (totalMintpUSD.total * 4n); */

      const reward = utils.parseEther(await getTotalAPY()).toBigInt();

      setRewardsAmountToAPY(reward);
    } catch (e) {
      console.log(e);
      setRewardsAmountToAPY(0n);
    }
    // dispatch(setLoading({ name: "apy", value: false }));
  };

  const getCRatio = (currencyName, mintAmount, stakeAmount) => {
    if (mintAmount === "" || !mintAmount) {
      mintAmount = "0";
    }

    try {
      let mintAmountToPERI =
        (BigInt(utils.parseEther(mintAmount).toString()) * BigInt(Math.pow(10, 18).toString())) /
        exchangeRates["PERI"];

      let totalDEBT =
        (balances["DEBT"].balance * BigInt(Math.pow(10, 18).toString())) / exchangeRates["PERI"] +
        mintAmountToPERI;

      const USDCTotalStake =
        currencyName === "USDC"
          ? balances["USDC"].staked + BigInt(utils.parseEther(stakeAmount).toString())
          : balances["USDC"].staked;
      const USDCStakedToPERI = (USDCTotalStake * exchangeRates["USDC"]) / exchangeRates["PERI"];

      const DAITotalStake =
        currencyName === "DAI"
          ? balances["DAI"].staked + BigInt(utils.parseEther(stakeAmount).toString())
          : balances["DAI"].staked;
      const DAIStakedToPERI = (DAITotalStake * exchangeRates["DAI"]) / exchangeRates["PERI"];

      setCRatio(
        (BigInt(Math.pow(10, 18).toString()) * 100n) /
          ((totalDEBT * BigInt(Math.pow(10, 18).toString())) /
            (balances["PERI"].balance + DAIStakedToPERI + USDCStakedToPERI))
      );
    } catch (e) {
      setCRatio(0n);
    }
  };

  useEffect(() => {
    if (!hash) {
      setMintAmount("");
      setStakeAmount("");
      getCRatio(currencies[slideIndex].name, "0", "0");
    }
  }, [hash]);

  useEffect(() => {
    if (exchangeIsReady) {
      getAPY();
    }
  }, [exchangeIsReady, networkId]);

  useEffect(() => {
    if (exchangeIsReady) {
      if (balancesIsReady && isConnect) {
        getMaxAmount(currencies[slideIndex]);
        getCRatio(currencies[slideIndex].name, mintAmount, stakeAmount);
      } else {
        setMaxStakeAmount("");
        setMaxMintAmount("");
        setCRatio(0n);
      }
    }
  }, [exchangeIsReady, balancesIsReady, exchangeRates, balances, isConnect]);

  useEffect(() => {
    if (slideIndex !== null) {
      setActiveCurrency(currencies[slideIndex]);
      setIsApprove(false);
      setMintAmount("");
      setStakeAmount("");
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
        <H1>MINT</H1>
      </Title>
      <StakeContainer>
        <Swiper
          spaceBetween={20}
          direction={"vertical"}
          slidesPerView={3}
          centeredSlides={true}
          mousewheel={true}
          allowTouchMove={true}
          initialSlide={0}
          breakpoints={{
            "1023": {
              allowTouchMove: false,
            },
          }}
          onSlideChange={({ activeIndex }) => setSlideIndex(activeIndex)}
          virtual
        >
          {currencies.map((currency, index) => (
            <SwiperSlide key={currency.name} virtualIndex={index}>
              <MintCard
                hide={index < slideIndex}
                isActive={index === slideIndex}
                currencyName={currency.name}
                maxAction={() =>
                  isConnect ? onChangeMintAmount(maxMintAmount, currency.name) : connectHelp()
                }
                stakeAmount={stakeAmount}
                mintAmount={mintAmount}
                onChange={onChangeMintAmount}
                apy={rewardsAmountToAPY}
                cRatio={cRatio}
                isApprove={isApprove}
                approveAction={() => approveAction(currency.name)}
                mintAction={() => mintAction()}
              ></MintCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </StakeContainer>
    </Container>
  );
};

export const Container = styled.div`
  display: flex;
  position: relative;
  top: -70px !important;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const Title = styled.div<{ $show?: boolean }>`
  display: flex;
  visibility: ${(props) => (props.$show ? "visible" : "hidden")};
  position: absolute;
  justify-content: center;
  width: 100%;
  z-index: 0;
  top: 70px;

  ${({ theme }) => theme.media.mobile`
    justify-content: center;
    h1 {
      font-size: 2rem;
      margin-bottom: 0;
    }
  `}

  ${({ theme }) => theme.media.tablet`
    justify-content: center;
    h1 {
      font-size: 2.5rem;
      margin-top: 0;
    }
  `}
`;

export const StakeContainer = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100% !important;

  .swiper-container {
    width: 100% !important;
  }

  .swiper-wrapper {
    top: -10% !important;
  }

  ${({ theme }) => theme.media.mobile`
    height: 100%;
    .swiper-container {
      top: -5% !important;
      margin: 0 5px;
      overflow: visible;
    }

    .swiper-wrapper {
      height: fit-content !important;
      top: 0px !important;
    }

    .swiper-slide.swiper-slide-next  {
      margin-top: 0% !important;
    }

	`}

  ${({ theme }) => theme.media.tablet`
    height: 100%;
    .swiper-container {
      top: 0 !important;
      margin: 0 5px;
      overflow: visible;
      margin: 0 auto;
    }

    .swiper-wrapper {
      height: fit-content !important;
    }

	`}
`;

export default Mint;
