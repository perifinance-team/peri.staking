import { useEffect, useState, useCallback, useRef } from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

import { BaseContainer } from "components/container";
import { Paragraph } from "components/paragraph";
import { SUPPORTED_NETWORKS, changeNetwork } from "lib/network";
import { MAINNET, TESTNET } from "lib/network/supportedNetWorks";
import { networkInfo } from "configure/networkInfo";

const NetCombo = ({ isShow, setIsShow }) => {
  const { networkName, address, isConnect, networkId } = useSelector(
    (state: RootState) => state.wallet
  );

  const [networks, setNetworks] = useState({});

  const showList = async (key) => {
    if (!isConnect) return;
    changeNetwork(key);
    setIsShow(false);
  };

  const netRef = useRef<HTMLDivElement>(null);
  const closeModalHandler = useCallback(
    (e) => {
        if (
          isShow &&
            e.target.id !== "net_caller" &&
            !netRef.current?.contains(e.target)
        ) {
          setIsShow(false);
        }
    }, [isShow]
  );

  useEffect(() => {
    window.addEventListener("click", closeModalHandler);
    return () => {
        window.removeEventListener("click", closeModalHandler);
    };
  }, [closeModalHandler]);

  useEffect(() => {
    if (isNaN(networkId) || networkId === null) return;
    const networks = Object.keys(MAINNET).includes(networkId.toString()) ? MAINNET : TESTNET;
    setNetworks(networks);
  }, [networkId]);

  return (
    <>
      {/* {networkName && address && isConnect ? ( */}
        <DisplayContainer
          id="net_caller" 
          $height={"100%"}
          $padding={"0px 10px"}
          $position={"relative"}
          $minWidth={15}
          $isShow={isShow}
          onClick={() => setIsShow(!isShow)}
        >
          <NetworkImg
            id="net_caller" 
            src={`/images/network/${SUPPORTED_NETWORKS[networkId] ? networkId : "unsupported"}.svg`}
          ></NetworkImg>
          <NetworkImg
            id="net_caller" 
            src={`/images/icon/${isShow ? "up-arrow" : "down-arrow"}.svg`}
          ></NetworkImg>
          <NetworkListContainer $isShow={isShow} ref={netRef}>
            <ul>
              {Object.keys(networks).map((key) => (
                <NetworkList
                  key={key}
                  onClick={() => showList(key)}
                >
                  <LabelContainer
                    $height={"30"}
                    $padding={"0px 5px"}
                    onClick={() => showList(key)}
                  >
                    <NetworkImg
                      src={`/images/network/${SUPPORTED_NETWORKS[key] ? key : "Unsupported"}.svg`}
                    ></NetworkImg>
                    <Paragraph $fontSize={1.4} $weight={"m"} $color={"primary"}>
                      {networkInfo[key].chainName}
                    </Paragraph>
                  </LabelContainer>
                </NetworkList>
              ))}
            </ul>
          </NetworkListContainer>
        </DisplayContainer>
      {/* ) : (
        <> </>
       )} */}
    </>
  );
};

export const DisplayContainer = styled(BaseContainer)<{
  $height: string | number;
  $padding?: string;
  $position?: string;
  $minWidth?: number;
  $isShow?: boolean;
}>`
  display: flex;
  cursor: pointer;
  border-radius: ${(props) => (props.$isShow ? "16px 16px 0px 0px" : "25px")};
  &:active {
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  &:hover {
    box-shadow: 0 0 1px ${(props) => props.theme.colors.border.primary};\
  }
`;

const NetworkListContainer = styled.div<{ $isShow: boolean }>`
  position: absolute;
  place-self: flex-end;
  top: 30px;
  right: 0px;
  width: 100%;
  height: 100%;
  z-index: 999;
  border-radius: 20px;
  display: ${(props) => (props.$isShow ? "flex" : "none")};
  ul {
    list-style: none;
    padding: 0px;
    margin: 0px;
    z-index: 998;
  }
`;

const NetworkList = styled.li`
  display: flex;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 3px;
  justify-content: flex-start;
  z-index: 997;
  color: ${(props) => props.theme.colors.font.primary};
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.background.panel};
  &:hover {
    background-color: ${(props) => props.theme.colors.background.body};
  }
`;

const LabelContainer = styled(BaseContainer)<{ $height: string | number; $padding: string }>`
  background-color: inherit;
`;

export const NetworkImg = styled.img`
  display: flex;
  width: 15px;
  height: 15px;
  margin: 0px 3px 0px 3px;
  justify-content: center;
  // border-radius: 50px;
`;

const SafeParagraph = styled(Paragraph)`
  ${({ theme }) => theme.media.desktop`
  display: table-cell;
`}

  ${({ theme }) => theme.media.mobile`
  display: none;
`}
`;

export default NetCombo;
