import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";
import { clearWallet, clearBalances } from "config/reducers/wallet";
import { RoundButton } from "components/button";
import { H4 } from "components/headding";
import { onboard } from "lib/onboard";
import { updateVestable } from "config/reducers/vest";

import { clearCRatio } from "config/reducers/rates";

const Connect = () => {
  const dispatch = useDispatch();
  const { isConnect } = useSelector((state: RootState) => state.wallet);

  const onConnect = async () => {
    try {
      await onboard.walletSelect();
      await onboard.walletCheck();
    } catch (e) {}
  };

  const onDisConnect = () => {
    ////todo:: need bug
    onboard.walletReset();
    localStorage.removeItem("selectedWallet");
    dispatch(clearWallet());
    dispatch(clearCRatio());
    dispatch(clearBalances());
    dispatch(updateVestable({ vestable: false }));
  };

  return (
    <RoundButton
      height={30}
      padding={"0px 15px"}
      onClick={() => {
        isConnect ? onDisConnect() : onConnect();
      }}
      color={"tertiary"}
      margin={"0px"}
      border={"none"}
      width={120}
    >
      <H4 fontSize={1.4} weigth={"b"} color={"primary"}>
        {isConnect ? "DISCONNECT" : "CONNECT"}
      </H4>
    </RoundButton>
  );
};

export default Connect;
