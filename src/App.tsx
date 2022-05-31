import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled, { ThemeProvider } from "styled-components";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import { RootState } from "config/reducers";
import { updateThemeStyles } from "config/reducers/theme";
import { updateRatio } from "config/reducers/rates";
import { updateExchangeRates } from "config/reducers/rates";
import { updateVestable } from "config/reducers/vest";
import {
  updateAddress,
  updateNetwork,
  updateIsConnect,
} from "config/reducers/wallet";
import { updateNetworkFee } from "config/reducers/networkFee";
import { resetTransaction } from "config/reducers/transaction";
import { setLoading } from "config/reducers/loading";
import { getNetworkFee } from "lib/fee";
import { SUPPORTED_NETWORKS } from "lib/network";

import { clearWallet, clearBalances } from "config/reducers/wallet";
import { clearCRatio } from "config/reducers/rates";

import { initCurrency } from "config/reducers/wallet";
import { InitOnboard, onboard } from "lib/onboard/onboard";
import { contracts } from "lib/contract";
import { getVestable } from "lib/vest";
import { getBalances } from "lib/balance";
import { getRatios } from "lib/rates";
import Loading from "./screens/Loading";
import Main from "./screens/Main";
import "./App.css";

import { getDebts } from "lib/balance/getDebts";
import {
  toggleLiquid,
  updateList,
  updateThisState,
} from "config/reducers/liquidation";
import axios from "axios";

const App = () => {
  const { address, networkId } = useSelector(
    (state: RootState) => state.wallet
  );
  const { balances } = useSelector((state: RootState) => state.balances);
  const transaction = useSelector((state: RootState) => state.transaction);

  const themeStyles = useSelector(
    (state: RootState) => state.themeStyles.styles
  );
  const themeState = useSelector((state: RootState) => state.theme.theme);

  const dispatch = useDispatch();
  const intervelTime = 1000 * 60 * 3;
  const [intervals, setIntervals] = useState(null);
  const [onboardInit, setOnboardInit] = useState(false);

  const getSystemData = useCallback(
    async (isLoading) => {
      dispatch(setLoading({ name: "balance", value: isLoading }));
      try {
        const [ratios, gasPrice] = await Promise.all([
          getRatios(address),
          getNetworkFee(networkId),
        ]);

        dispatch(updateRatio(ratios.ratio));
        dispatch(updateExchangeRates(ratios.exchangeRates));

        dispatch(updateNetworkFee({ gasPrice }));

        if (address) {
          const [balancesData, vestable] = await Promise.all([
            getBalances(
              address,
              balances,
              ratios.exchangeRates,
              ratios.ratio.targetCRatio,
              ratios.ratio.currentCRatio
            ),
            getVestable(address),
          ]);
          dispatch(initCurrency(balancesData));
          //todo:: code move call
          dispatch(updateVestable({ vestable }));
        }
      } catch (e) {}
      dispatch(setLoading({ name: "balance", value: false }));
    },
    [address, networkId, setLoading]
  );

  const setOnboard = async () => {
    let networkId = Number(process.env.REACT_APP_DEFAULT_NETWORK_ID);
    contracts.init(networkId);
    dispatch(updateNetwork({ networkId: networkId }));
    try {
      InitOnboard(
        networkId,
        {
          wallet: async (wallet) => {
            if (wallet.provider) {
              contracts.wallet = wallet;
              localStorage.setItem("selectedWallet", wallet.name);
            }
          },
          address: async (newAddress) => {
            if (newAddress) {
              if (SUPPORTED_NETWORKS[onboard.getState().network]) {
                contracts.connect(newAddress);
                dispatch(clearBalances());
                dispatch(clearCRatio());
                dispatch(updateAddress({ address: newAddress }));
                dispatch(updateIsConnect(true));
              } else {
                onboard.walletReset();
              }
            }
          },
          network: async (network) => {
            if (network) {
              if (SUPPORTED_NETWORKS[network]) {
                contracts.init(network);
                onboard.config({ networkId: network });
                dispatch(updateNetwork({ networkId: network }));
                contracts.connect(address);
              } else {
                NotificationManager.warning(
                  `This network is not supported. Please change to bsc or polygon or ethereum network`,
                  "ERROR"
                );
                onboard.walletReset();
                onboard.config({ networkId: network });
                dispatch(updateNetwork({ networkId: network }));
                dispatch(updateIsConnect(false));
                localStorage.removeItem("selectedWallet");
                dispatch(clearWallet());
                dispatch(clearCRatio());
                dispatch(clearBalances());
                dispatch(updateVestable({ vestable: false }));
                clearInterval(intervals);
              }
            }
          },
        },
        themeState === "dark"
      );
    } catch (e) {
      console.log(e);
      localStorage.clear();
      // window.location.reload()
    }
    const selectedWallet = localStorage.getItem("selectedWallet");

    if (selectedWallet) {
      try {
        await onboard.walletSelect(selectedWallet);
        await onboard.walletCheck();
      } catch (e) {
        console.log(e);
      }
    }
    setOnboardInit(true);
  };

  useEffect(() => {
    if (transaction.hash) {
      const getState = async () => {
        await contracts.provider.once(
          transaction.hash,
          async (transactionState) => {
            if (transactionState.status !== 1) {
              NotificationManager.remove(NotificationManager.listNotify[0]);
              NotificationManager.warning(`${transaction.type} error`, "ERROR");
            } else {
              await getSystemData(true);
              NotificationManager.remove(NotificationManager.listNotify[0]);
              NotificationManager.success(
                `${transaction.type} success`,
                "SUCCESS"
              );
              dispatch(resetTransaction());
            }
          }
        );
      };
      getState();
      NotificationManager.info(transaction.message, "In progress", 0);
    }
    // eslint-disable-next-line
  }, [transaction]);

  useEffect(() => {
    if (!onboardInit) {
      setOnboard();
    }
    dispatch(updateThemeStyles(themeState));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (onboardInit && networkId !== 0) {
      getSystemData(true);
      if (intervals) {
        clearInterval(intervals);
      }
      setIntervals(setInterval(() => getSystemData(false), intervelTime));
    }
    // eslint-disable-next-line
  }, [networkId, address, onboardInit]);

  useEffect(() => {
    axios
      .get("")
      .then()
      .catch((e) => console.log(e));

    const liquidationList = [
      {
        idx: "oxlx2y",
        cRatio: "140",
        debt: 100,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 5 },
          { name: "USDC", value: 5 },
        ],
        status: 0,
      },
      {
        idx: "oxlx3y",
        cRatio: "120",
        debt: 50,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 5 },
          { name: "USDC", value: 0 },
        ],
        status: 1,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
      {
        idx: "oxlx4y",
        cRatio: "110",
        debt: 500,
        collateral: [
          { name: "Peri", value: 95 },
          { name: "Dai", value: 0 },
          { name: "USDC", value: 5 },
        ],
        status: 2,
      },
    ];

    dispatch(updateList(liquidationList));

    // ! 컨트랙트에서 받아온 liquidation 여부 스토어에 업데이트 ? => 스토어에 관리하지 말고 직접 받아서 사용

    let tempLiquid = false;

    dispatch(toggleLiquid(tempLiquid));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const thisState = {
      idx: "oxlx1y",
      cRatio: "0",
      debt: 0,
      collateral: [
        { name: "Peri", value: 0 },
        { name: "Dai", value: 0 },
        { name: "USDC", value: 0 },
      ],
      status: 0,
    };

    dispatch(updateThisState(thisState));
    // ! 업데이트 주기 뭐로하지
  });

  // <input type="text" value={userAddress} onChange={(e) => {setUserAddress(e.target.value)}} />
  // <button onClick={() => getDebts(userAddress)}>getDebts</button>

  return (
    <>
      <Loading></Loading>
      <ThemeProvider theme={themeStyles}>
        <Main></Main>
      </ThemeProvider>
      <NotificationContainer />
    </>
  );
};

export default App;
