import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";
import { clearWallet, clearBalances } from "config/reducers/wallet";
import { RoundButton } from "components/button";
import { web3Onboard } from "lib/onboard/web3Onboard";
import { updateVestable } from "config/reducers/vest";
import { BaseImg } from "components/image";
import { clearCRatio } from "config/reducers/rates";
import { Paragraph } from "components/paragraph";
import { Container } from "components/container";

const Connect = () => {
  const dispatch = useDispatch();
  const { isConnect } = useSelector((state: RootState) => state.wallet);

  const onConnect = async () => {
    try {
      const selectedWallet = localStorage.getItem("selectedWallet");
      if (selectedWallet === "undefined") {
        localStorage.removeItem("selectedWallet");
      }
      await web3Onboard.connect(selectedWallet);
      console.log("connect success");
    } catch (e) {
      console.log("connect error", e);
    }
  };

  const onDisConnect = () => {
    ////todo:: need bug
    web3Onboard.disconnect();
    localStorage.removeItem("selectedWallet");
    dispatch(clearWallet());
    dispatch(clearCRatio());
    dispatch(clearBalances());
    dispatch(updateVestable({ vestable: false }));
  };

  return (
    <Container
      height={30}
      padding={"0px 5px"}
      onClick={() => {
        isConnect ? onDisConnect() : onConnect();
      }}
      // color={"tertiary"}
      // margin={"0px"}
      // border={"none"}
      minWidth={33}
    >
      {!isConnect && (
        <Paragraph $fontSize={1.2} $weight={"m"} $color={"primary"} $margin={"0 3px"}>
          Connect
        </Paragraph>
      )}
      <BaseImg $height={18} $width={18}
        src={`/images/icon/${isConnect ? "power_on" : "power_off"}.png`}
        onClick={() => {
          isConnect ? onDisConnect() : onConnect();
        }}
      ></BaseImg>
    </Container>
  );
};

export default Connect;
