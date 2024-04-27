import { useEffect, useState, useCallback, useRef } from "react";
import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "config/reducers";

import { BaseContainer } from "components/container";
import { Paragraph } from "components/paragraph";
import { SUPPORTED_NETWORKS, changeNetwork } from "lib/network";
import { MAINNET, TESTNET } from "lib/network/supportedNetWorks";
import { networkInfo } from "configure/networkInfo";
import { updateNetwork } from "config/reducers/wallet";

const NetCombo = ({ isShow, setIsShow }) => {
  const dispatch = useDispatch();
  const { isConnect, networkId } = useSelector(
    (state: RootState) => state.wallet
  );
  
  const [networks, setNetworks] = useState({});

  const showList = async (key) => {
    if (!isConnect) {
      dispatch(updateNetwork({ networkId: Number(key) }));
      return;
    }

    changeNetwork(key);
    setIsShow(!isShow);
  };

  const netRef = useRef<HTMLDivElement>(null);
  const closeModalHandler = useCallback(
    (e) => {
      if (isShow && e.target.id !== "net_caller" && !netRef.current?.contains(e.target)) {
        setIsShow(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // const networks = process.env.REACT_APP_ENV === "production" ? MAINNET : TESTNET;
    setNetworks(networks);
  }, [networkId]);

  return (
    <>
      {/* {networkName && address && isConnect ? ( */}
      <DisplayContainer
        id="net_caller"
        $height={"100%"}
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
        <BlockContainer $isShow={isShow}/>
        <NetworkListContainer $isShow={isShow} ref={netRef}>
          <ul>
            {Object.keys(networks).map(
              (key) =>
                key !== "1337" && (
                  <NetworkList key={key} onClick={() => showList(key)}>
                    <LabelContainer
                      $height={"30"}
                      $padding={"0px 5px"}
                      /* onClick={() => showList(key)} */
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

export const DisplayContainer = styled.button<{
  $height: string;
  $position?: string;
  $minWidth?: number;
  $isShow?: boolean;
}>`
  display: flex;
  cursor: pointer;
  overflow: visible;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 0 3px 0 5px;
  height: ${(props) => `${props.$height}`};
  border-radius: ${(props) => (props.$isShow ? "16px 16px 0px 0px" : "25px")};
  background-color: ${(props) => props.theme.colors.background.body};
  border: 1px solid ${(props) => (props.$isShow 
    ? `${props.theme.colors.border.tableRow}` 
    : `${props.theme.colors.border.third}` )};
  ${(props) => (props.$isShow ? `z-index: 99` : null)};
  box-shadow: ${(props) => (props.$isShow 
    ? `0px 0px 10px ${props.theme.colors.border.primary}` 
    : `0px 0px 0px ${props.theme.colors.border.primary}`
  )};

  &:active {
    transition: 0.2s ease-in-out;
    transform: translateY(5%);
    border: 1px solid ${(props) => props.theme.colors.border.tableRow};
  }

  &:hover {
    // transition: 0.2s ease-in-out;
    // transform: translateY(-1px);
    border: 1px solid ${(props) => props.$isShow 
      ? `${props.theme.colors.border.tableRow};`
      : `${props.theme.colors.border.third};`
    }

    box-shadow: ${(props) => props.$isShow 
      ? `0px 0px 10px ${props.theme.colors.border.primary};`
      : `0px 0px 0px ${props.theme.colors.border.primary};`
    }
  }

  ${({ theme }) => theme.media.tablet`
    height: 32px;
  `}

`;

const NetworkListContainer = styled.div<{ $isShow: boolean }>`
  position: absolute;
  place-self: flex-end;
  top: 30px;
  right: -1px;
  width: fit-content;
  height: fit-content;
  border-radius: 10px 0 10px 10px;
  overflow: hidden;
  z-index: 88;
  display: ${(props) => (props.$isShow ? "flex" : "none")};
  border: 0.5px solid ${(props) => props.theme.colors.border.tableRow};
  background-color: ${(props) => props.theme.colors.background.body};
  box-shadow: ${(props) => `0px 0px 10px ${props.theme.colors.border.primary}`};

  ul {
    list-style: none;
    padding: 0px;
    margin: 0px;
    z-index: 89;
    position: relative;
    
  }

  ${({ theme }) => theme.media.mobile`
    top: 30px;

    ul {
      width: 110px;
    }
  `}
`;

const BlockContainer = styled.div<{ $isShow: boolean }>`
  display: ${(props) => (props.$isShow ? "static" : "none")};
  position: absolute;
  top: 15px;
  right: 0px;
  width: 100%;
  height: 20px;
  background-color: ${(props) => props.theme.colors.background.body};
  z-index: 91;

  // ${({ theme }) => theme.media.mobile`
  //   top: 21px;
  // `}
`;

const NetworkList = styled.li`
  display: flex;
  font-size: 14px;
  cursor: pointer;
  justify-content: flex-start;
  z-index: 90;
  padding: 8px 6px;
  min-width: 110px;
  color: ${(props) => props.theme.colors.font.primary};
  cursor: pointer;
  
  &:hover {
    box-shadow: ${(props) => `0.5px 1.5px 0px ${props.theme.colors.background.button.primary}`};
    border: 1px solid ${(props) => props.theme.colors.border.tableRow};
    transform: translateY(-5%);
  }

  ${({ theme }) => theme.media.mobile`
    min-width: 85x;
    padding: 8px 6px;
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
  z-index: 92;

  ${({ theme }) => theme.media.mobile`
    width: 15px;
    height: 15px;
  `}
`;

const ListBtnImg = styled(NetworkImg)`
  z-index: 92;
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

// const SafeParagraph = styled(Paragraph)`
//   ${({ theme }) => theme.media.desktop`
//     display: table-cell;
//   `}

//   ${({ theme }) => theme.media.mobile`
//     display: none;
//   `}
// `;

export default NetCombo;
