import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

import { RoundContainer } from "components/container";
import { Paragraph } from "components/paragraph";

const Network = () => {
  const { networkName, address, isConnect } = useSelector(
    (state: RootState) => state.wallet
  );

  return (
    <>
      {networkName && address && isConnect ? (
        <RoundContainer height={30} padding={"0px 30px"}>
          <Paragraph fontSize={1.2} weigth={"m"} color={"primary"}>
            {address.slice(0, 6) + "..." + address.slice(-4, address.length)}
          </Paragraph>
          <Dot></Dot>
          <Paragraph fontSize={1.4} weigth={"b"} color={"primary"}>
            {networkName}
          </Paragraph>
        </RoundContainer>
      ) : (
        <> </>
      )}
    </>
  );
};

const Dot = styled.div`
  width: 13px;
  height: 13px;
  margin: 0px 10px 0px 20px;
  background-color: ${(props) =>
    props.theme.colors.background.button.secondary};
  border-radius: 50px;
`;

export default Network;
