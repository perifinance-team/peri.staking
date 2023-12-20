import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

import { BaseContainer } from "components/container";
import { Paragraph } from "components/paragraph";
import NetCombo from "./NetCombo";
import Connect from "./Connect";

const Network = () => {
  const { networkName, address, isConnect } = useSelector(
    (state: RootState) => state.wallet
  );

  const [isShow, setIsShow] = React.useState(false);

  return (
    <Container>
      <NetCombo isShow={isShow} setIsShow={setIsShow} />
      <DisplayContainer
        $height={"100%"}
        $padding={"0px 5px"}
        $position={"relative"}
        $minWidth={30}
      >
        {networkName && address && isConnect && (
          <Paragraph $fontSize={1.2} $weight={"m"} $color={"primary"} $margin={"3px 0"}>
            {address.slice(0, 6) + "..." + address.slice(-4, address.length)}
          </Paragraph>
        )/* :(
          <Paragraph $fontSize={1.2} $weight={"m"} $color={"primary"}>
            Connect
          </Paragraph>
        ) */}
        <Connect />
      </DisplayContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 160px;
  height: 100%;
  border-radius: 25px;
  box-shadow: 0px 0px 25px ${(props) => props.theme.colors.border.primary};
  background-color: ${(props) => props.theme.colors.background.panel};
  border: ${(props) => `1px solid ${props.theme.colors.border.primary}`};
`;

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
    box-shadow: 0 0 1px ${(props) => props.theme.colors.border.primary};\
  }
`;

export default Network;
