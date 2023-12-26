import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { Paragraph } from "components/paragraph";
import NetCombo from "./NetCombo";
import Connect from "./Connect";
import { RoundButton } from "components/button";

const Network = () => {
  const { networkName, address, isConnect } = useSelector(
    (state: RootState) => state.wallet
  );

  const [isShow, setIsShow] = React.useState(false);

  return (
    <Container>
      <NetCombo isShow={isShow} setIsShow={setIsShow} />
      <RoundButton
        height={"100%"}
        padding={"0px 5px"}
        minWidth={33}
        shadow={"primary"}
      >
        {networkName && address && isConnect && (
          <Paragraph $fontSize={0.75} $weight={"m"} $color={"primary"} $margin={"0"}>
            {address.slice(0, 6) + "..." + address.slice(-4, address.length)}
          </Paragraph>
        )}
        <Connect />
      </RoundButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 160px;
  height: 35px;
  border-radius: 25px;
  overflow: visible;
  // background-color: ${(props) => props.theme.colors.background.button.fifth};
  // border: ${(props) => `1px solid ${props.theme.colors.border.tableRow}`};
  // box-shadow: 0.5px 2px 0px ${(props) => props.theme.colors.border.primary};

  ${({ theme }) => theme.media.mobile`
    height: 26px;
    min-width: 140px;
  `}
`;
/* 
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
  &:hover {
    box-shadow: 0 0 2px ${(props) => props.theme.colors.border.primary};
  }
`;
 */
export default Network;
