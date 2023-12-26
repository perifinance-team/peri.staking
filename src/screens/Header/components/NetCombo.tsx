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
      if (isShow && e.target.id !== "net_caller" && !netRef.current?.contains(e.target)) {
        setIsShow(false);
      }
    },
    [isShow]
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
        $minWidth={15}
        $isShow={isShow}
        onClick={() => setIsShow(!isShow)}
      >
        <NetworkImg
          id="net_caller"
          src={`/images/network/${SUPPORTED_NETWORKS[networkId] ? networkId : "unsupported"}.svg`}
        ></NetworkImg>
        <ListBtnImg
          id="net_caller"
          src={`/images/icon/${isShow ? "up-arrow" : "down-arrow"}.svg`}
        ></ListBtnImg>
        <NetworkListContainer $isShow={isShow} ref={netRef}>
          <ul>
            {Object.keys(networks).map(
              (key) =>
                key !== "1337" && (
                  <NetworkList key={key} onClick={() => showList(key)}>
                    <LabelContainer
                      $height={"30"}
                      $padding={"0px 5px"}
                      onClick={() => showList(key)}
                    >
                      <NetworkImg
                        src={`/images/network/${SUPPORTED_NETWORKS[key] ? key : "Unsupported"}.svg`}
                      ></NetworkImg>
                      <Paragraph $fontSize={0.875} $weight={"m"} $color={"primary"}>
                        {networkInfo[key].chainName}
                      </Paragraph>
                    </LabelContainer>
                  </NetworkList>
                )
            )}
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
  overflow: visible;
  position: relative;
  border-radius: ${(props) => (props.$isShow ? "16px 16px 0px 0px" : "25px")};

  // ${(props) => (props.$isShow ? `box-shadow:0px 0px 10px ${props.theme.colors.background.button.primary}}` : null)};
  ${(props) => (props.$isShow ? `border: 1px solid ${props.theme.colors.border.tableRow}` : null)};
  ${(props) => (props.$isShow ? `z-index: 999` : null)};

  &:active {
    transition: 0.2s ease-in-out;
    transform: translateY(5%);
    border: 1px solid ${(props) => props.theme.colors.border.tableRow};
  }

  &:hover {
    transition: 0.2s ease-in-out;
		transform: translateY(-1px);
		box-shadow: ${({theme}) => `0.5px 3px 0px ${theme.colors.border.primary}`};
  }

  ${({ theme }) => theme.media.mobile`
    height: 26px;
  `}
`;

const NetworkListContainer = styled.div<{ $isShow: boolean }>`
  position: absolute;
  place-self: flex-end;
  top: 35px;
  right: 0px;
  width: fit-content;
  height: fit-content;
  border-radius: 16px 0 16px 16px;
  overflow: hidden;
  z-index: 988;
  display: ${(props) => (props.$isShow ? "flex" : "none")};
  
  
  
  ul {
    list-style: none;
    padding: 0px;
    margin: 0px;
    z-index: 989;
    top: -1px;
    position: relative;
    border: 0.5px solid ${(props) => props.theme.colors.border.tableRow};
    // ${(props) => (props.$isShow ? `box-shadow:0px 0px 2px ${props.theme.colors.background.button.primary}}` : null)};
  }

  ${({ theme }) => theme.media.mobile`
    top: 26px;

    ul {
      left: -1px;
      width: 110px;
    }
  `}
`;

const NetworkList = styled.li`
  display: flex;
  font-size: 14px;
  cursor: pointer;
  justify-content: flex-start;
  z-index: 990;
  padding: 8px 6px;
  min-width: 110px;
  color: ${(props) => props.theme.colors.font.primary};
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.background.body};
  &:hover {
    box-shadow: ${(props) => `0.5px 1.5px 0px ${props.theme.colors.background.button.primary}`};
    border: 1px solid ${(props) => props.theme.colors.border.tableRow};
    transform: translateY(-5%);
  }

  ${({ theme }) => theme.media.mobile`
    min-width: 85x;
    padding: 6px 6px;
    width: fit-content;
    font-size: 11px;
  `}
`;

const LabelContainer = styled(BaseContainer)<{ $height: string | number; $padding: string }>`
  background-color: inherit;

  ${({ theme }) => theme.media.mobile`
    p {
      font-size: 11px;
      width: fit-content;
    }
  `}
`;

export const NetworkImg = styled.img`
  display: flex;
  width: 17px;
  height: 17px;
  margin: 0 6px 0 0;
  justify-content: center;
  // border-radius: 50px;

  ${({ theme }) => theme.media.mobile`
    width: 15px;
    height: 15px;
  `}
`;

const ListBtnImg = styled(NetworkImg)`
  &:hover {
    transition: 0.2s ease-in-out;
    transform: translateY(10%);
  }

  &:active {
    // transition: 0.1s ease-in-out;
    transform: scaleY(-1);
  }

  ${({ theme }) => theme.media.mobile`
    width: 15px;
    height: 15px;
  `}
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
