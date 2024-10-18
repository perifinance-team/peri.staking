import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";

import { getBalances } from "lib/balance";
import { getRatios } from "lib/rates";
import { NotificationManager } from "react-notifications";
import {
  clearPynths,
  setBalances,
  setIsLoading,
  setIsReady,
  updatePynths,
} from "config/reducers/wallet";
import { updateRatio } from "config/reducers/rates";
import { updateExchangeRates } from "config/reducers/rates";
import { useLocation } from "react-router-dom";
import { getLiquidationList } from "lib/liquidation";
import { getEscrowList } from "lib/escrow";
import { contracts } from "lib/contract";
import { setReady, updateEscrowList } from "config/reducers/escrow";
import { getPynthBalances } from "lib/thegraph/api";
import { createCompareFn } from "lib";
import { networkInfo } from "configure/networkInfo";
import { updateTimestamp, toggleLiquid } from "config/reducers/liquidation";
import { end, start } from "lib/etc/performance";
import { getNetworkFee } from "lib/fee";
import { updateNetworkFee } from "config/reducers/networkFee";
import { resetTransaction } from "config/reducers/transaction";
import { natives } from "lib/rpcUrl/rpcUrl";

const Refresh = () => {
  const dispatch = useDispatch();
  const { address, networkId } = useSelector((state: RootState) => state.wallet);
  const { balances, isLoading } = useSelector((state: RootState) => state.balances);
  const themeState = useSelector((state: RootState) => state.theme.theme);
  const location = useLocation();
  const { RewardEscrowV2, Liquidations } = contracts as any;

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
      const stakeTokens = {};
      Object.keys(balances)
        .filter((item) => balances[item].staking)
        .map((item) => (stakeTokens[item] = balances[item]));
      await getLiquidationList(dispatch, stakeTokens, networkId);
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

    start("refresh");
    // dispatch(clearBalances());
    dispatch(setIsLoading(true));
    try {
      if (address) {
        const [ratios, gasPrice] = await Promise.all([
          getRatios(address, natives[networkId]),
          getNetworkFee(networkId),
        ]);

        dispatch(updateRatio(ratios.ratio));
        dispatch(updateExchangeRates(ratios.exchangeRates));
        dispatch(updateNetworkFee({ gasPrice }));
        // console.log("exchangeRates", ratios.exchangeRates);
        const [balancesData, stateLiquid /* , timestamp */] = await Promise.all([
          getBalances(address, balances, ratios.exchangeRates, ratios.ratio.currentCRatio),
          Liquidations.getLiquidationInfo(address),
          // await getTimeStamp(address, Liquidations),
        ]);

        dispatch(setIsReady(false));
        dispatch(updateTimestamp(stateLiquid.deadline));
        dispatch(toggleLiquid(stateLiquid.isOpen));
        dispatch(setBalances(balancesData));
        dispatch(setIsReady(true));
      }
    } catch (e) {
      console.log(e);
      NotificationManager.warning(`Something went wrong while refershing.`, "Refresh Error");
      localStorage.removeItem("selectedWallet");
    }
    dispatch(setIsLoading(false));
    end();
  };

  return (
    <Container $isLoading={address && isLoading /* || !isReady */} onClick={() => getSystemData()}>
      <img src={`/images/${themeState}/refresh.svg`} alt="refresh"></img>
    </Container>
  );
};

const Container = styled.button<{ $isLoading?: boolean }>`
  border-radius: 50px;
  width: 35px;
  height: 35px;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background.button.fifth};
  border: ${(props) => `1.5px solid ${props.theme.colors.border.tableRow}`};
  box-shadow: 0.5px 1.5px 0px ${(props) => props.theme.colors.border.primary};

  ${({ $isLoading }) =>
    $isLoading &&
    `
    animation: spin 1s infinite ease-in-out;
    @keyframes spin {
      to {
        transform: rotate(1turn);
      }
    }
  `}

  img {
    width: 22px;
    height: 22px;
  }

  &:hover {
    transition: 1.5s;
    transform: rotate(360deg);
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
