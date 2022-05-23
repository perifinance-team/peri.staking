import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { H3, H4 } from "components/headding";
import { utils } from "ethers";
const Ratios = () => {
  const { targetCRatio, currentCRatio, liquidationRatio } = useSelector(
    (state: RootState) => state.ratio
  );

  const ratioToPer = (value) => {
    if (value === 0n) return "0";
    return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
  };

  return (
    <Container>
      <Row>
        <H3 weigth={"sm"}>C-Ratio</H3>
        <H3 weigth={"eb"} color={"fourth"}>
          {ratioToPer(currentCRatio)}%
        </H3>
      </Row>
      <Row>
        <H3 weigth={"sm"}>Target</H3>
        <H3 weigth={"eb"} color={"fourth"}>
          {ratioToPer(targetCRatio)}%
        </H3>
      </Row>
      <Row>
        <H3 weigth={"sm"}>Liquidation</H3>
        <H3 weigth={"eb"} color={"fourth"}>
          {ratioToPer(liquidationRatio)}%
        </H3>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  margin: 0px 0px 15px 0px;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  margin: 20px 0px 0px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export default Ratios;
