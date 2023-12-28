import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";

import { getVestable } from "lib/vest";
import { getBalances } from "lib/balance";
import { getRatios } from "lib/rates";
import { getNetworkFee } from "lib/fee";

import { initCurrency } from "config/reducers/wallet";
import { updateRatio } from "config/reducers/rates";
import { updateExchangeRates } from "config/reducers/rates";
import { updateVestable } from "config/reducers/vest";
import { updateNetworkFee } from "config/reducers/networkFee";
import { setLoading } from "config/reducers/loading";

const Refresh = () => {
  const dispatch = useDispatch();
  const { address, networkId } = useSelector(
    (state: RootState) => state.wallet
  );
  const { balances } = useSelector((state: RootState) => state.balances);
  const themeState = useSelector((state: RootState) => state.theme.theme);
  // const [isLoading, setIsLoading] = useState(false);

  const getSystemData = async () => {
    dispatch(setLoading({ name: "balance", value: true }));
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
