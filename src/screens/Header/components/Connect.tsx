import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";
import { clearWallet, clearBalances } from "config/reducers/wallet";
import { web3Onboard } from "lib/onboard";
import { updateVestable } from "config/reducers/vest";
import { BaseImg } from "components/image";
import { clearCRatio } from "config/reducers/rates";
import { Paragraph } from "components/paragraph";
import { useState } from "react";
// import { set } from "date-fns";

const Connect = () => {
  const { isConnect } = useSelector((state: RootState) => state.wallet);
  const { isLoading } = useSelector((state: RootState) => state.balances);
  const [ connecting, setConnecting ] = useState(false);

  const dispatch = useDispatch();

  const onConnect = async () => {
    try {
      setConnecting(true);
      // let selectedWallet = localStorage.getItem("selectedWallet");
      // console.log("selectedWallet", selectedWallet);
      // if (selectedWallet === "undefined" || selectedWallet === null) {
      //   localStorage.removeItem("selectedWallet");
      //   selectedWallet = undefined;
      // }
      await web3Onboard.connect();
    } catch (e) {
      console.log("connect error", e);
    }
    setConnecting(false);
  };

  const onDisConnect = () => {
    // // todo:: need bug
    web3Onboard.disconnect();
    localStorage.removeItem("selectedWallet");
    dispatch(clearWallet());
    dispatch(clearCRatio());
    dispatch(clearBalances());
    dispatch(updateVestable({ vestable: false }));
  };

  return (
    <ConnectContainer
      $connecting={connecting}
      disabled={isConnect && isLoading}
      onClick={() => {
        isConnect ? onDisConnect() : onConnect();
      }}
      
    >
      {!isConnect && (
        <ConnectLabel $fontSize={0.75} $weight={"m"} $color={"primary"} $margin={"0 3px"}>
          Connect
        </ConnectLabel>
      )}
      <ConnectImg $height={18} $width={18}
        src={`/images/icon/${isConnect ? "power_on" : "power_off"}.png`}
        /* onClick={() => {
          isConnect ? onDisConnect() : onConnect();
        }} */
      ></ConnectImg>
    </ConnectContainer>
  );
};

const ConnectContainer = styled.button<{$connecting: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  cursor: pointer;
  background-color: transparent;
  border: none;

  ${({ theme }) => theme.media.mobile`
      height: 26px;
  `} 

  img {
    transform: rotate(0deg);
    ${({ $connecting }) => $connecting && `
      animation: glow 2s infinite ease-in-out;
      @keyframes spin {
        to {
          transform: rotate(1turn);
        }
      }

      @keyframes glow {
        0%   {width: 18px; height: 18px;}
        25%  {width: 16px; height: 17px;}
        50%  {width: 18px; height: 18px;}
        75%  {width: 16px; height: 17px;}
        100% {width: 18px; height: 18px;}
        to {
          transform: rotate(1turn);
        }
      }
    `}
  }

  &:hover {
    img {
      transition: 0.5s;
      transform: rotate(90deg);
      cursor: pointer;
    }
  }
  
`;

const ConnectLabel = styled(Paragraph)`
  ${({ theme }) => theme.media.mobile`
    font-size: 11px;
  `}
`;

const ConnectImg = styled(BaseImg)`
  ${({ theme }) => theme.media.mobile`
    width: 15px;
    height: 15px;
  `}
`;

export default Connect;
