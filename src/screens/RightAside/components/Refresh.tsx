import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";

import { getVestable } from "lib/vest";
import { getBalances } from "lib/balance";
import { getRatios } from "lib/rates";
import { getNetworkFee } from "lib/fee";
import { NotificationManager } from "react-notifications"
import { clearPynths, setBalances, setIsNotReady, updatePynths } from "config/reducers/wallet";
import { updateRatio } from "config/reducers/rates";
import { updateExchangeRates } from "config/reducers/rates";
import { updateVestable } from "config/reducers/vest";
import { updateNetworkFee } from "config/reducers/networkFee";
import { useLocation } from "react-router-dom";
import { getLiquidationList } from "lib/liquidation";
import { getEscrowList } from "lib/escrow";
import { contracts } from "lib/contract";
import { setReady, updateEscrowList } from "config/reducers/escrow";
import { getPynthBalances } from "lib/thegraph/api";
import { createCompareFn } from "lib";
import { networkInfo } from "configure/networkInfo";

const Refresh = () => {
  const dispatch = useDispatch();
  const { address, networkId } = useSelector((state: RootState) => state.wallet);
  const { balances } = useSelector((state: RootState) => state.balances);
  const themeState = useSelector((state: RootState) => state.theme.theme);
  // const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { RewardEscrowV2 } = contracts as any;

  const getEscrowListData = async () => {
    dispatch(setReady(false));
    try {
      await getEscrowList(RewardEscrowV2, address).then((data: object[]) => {
        dispatch(updateEscrowList(data));
      });
    } catch (e) {
      console.log("getEscrow error", e);
      dispatch(setReady(true));
    }
  };

  const getLiquidationData = async () => {
    try {
      await getLiquidationList(dispatch, networkId);
    } catch (e) {}
  };

  const fetchPynthBalances = async () => {
    console.log(networkId, address);
    if (networkInfo[networkId] === undefined || !address) return;

    dispatch(clearPynths());
    const balances = await getPynthBalances({ networkId: networkId.toString(), address });

    console.log(balances);

    if (Array.isArray(balances)) {
      balances.sort(createCompareFn("usdBalance", "desc"));
      dispatch(updatePynths(balances));
    }

  };

  const getSystemData = async () => {
    if (location.pathname.includes("/liquidation")) {
      getLiquidationData();
      return;
    } else if (location.pathname.includes("/escrow")) {
      getEscrowListData();
      return;
    } else if (location.pathname.includes("/balance")) {
      fetchPynthBalances();
    }

    dispatch(setIsNotReady());
    try {
      const [ratios, gasPrice] = await Promise.all([getRatios(address), getNetworkFee(networkId)]);

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
        
        //todo:: code move call
        dispatch(updateVestable({ vestable }));
        dispatch(setBalances(balancesData));
      }
    } catch (e) {
      NotificationManager.warning(`Something went wrong while refershing.`);
    }
  };

  return (
    <Container /* disabled={isLoading} */ onClick={() => getSystemData()}>
      <img src={`/images/${themeState}/refresh.svg`} alt="refresh"></img>
    </Container>
  );
};

const Container = styled.button`
  border-radius: 50px;
  width: 35px;
  height: 35px;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background.button.fifth};
  border: ${(props) => `1.5px solid ${props.theme.colors.border.tableRow}`};
  box-shadow: 0.5px 1.5px 0px ${(props) => props.theme.colors.border.primary};
  img {
    width: 22px;
    height: 22px;
  }

  &:hover {
    transition: 0.5s;
    transform: rotate(90deg);
    box-shadow: 3.5px 0px 5px ${(props) => props.theme.colors.border.primary};
  }

  &:active {
    transform: rotate(180deg);
    box-shadow: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default Refresh;
