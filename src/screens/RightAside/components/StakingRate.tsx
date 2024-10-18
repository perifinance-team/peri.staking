import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { H4, H5 } from "components/heading";
import { useEffect, useState } from "react";
import { fromBigInt } from "lib/etc/utils";

const StakingRate = () => {
  const { currentCRatio, exStakingRatio, maxStakingRatio } = useSelector(
    (state: RootState) => state.ratio
  );
  const [PERIStakingPer, setPERIStakingPer] = useState(0);
  const [maxStakingPer, setMaxStakingPer] = useState(0);

  useEffect(() => {
    if (currentCRatio > 0n) {
      const periSR = (100 - Math.floor(Number(fromBigInt(exStakingRatio)) * 10000) / 100).toFixed(
        2
      );
      const maxSR = (Math.ceil(Number(fromBigInt(maxStakingRatio)) * 10000) / 100).toFixed(2);

      console.log("periSR", periSR, "maxSR", maxSR);

      setMaxStakingPer(Number(maxSR));
      setPERIStakingPer(Number(periSR));
    }
  }, [currentCRatio, exStakingRatio, maxStakingRatio]); // , exchangeRates

  return (
    <>
      {currentCRatio > 0n && (
        <StakingRateContainer>
          <Line $per={100 - maxStakingPer}></Line>
          <Container $per={PERIStakingPer} $maxPer={maxStakingPer}>
            <BarChartText $align={"left"}>{PERIStakingPer.toFixed(1)}%</BarChartText>
            <BarChartText $align={"right"}>{(100 - PERIStakingPer).toFixed(1)}%</BarChartText>
          </Container>
          <ChartContainer>
            <ChartLabel $align={"left"}>$Peri</ChartLabel>
            <ChartLabel $align={"right"}>$Others</ChartLabel>
          </ChartContainer>
        </StakingRateContainer>
      )}
    </>
  );
};

const StakingRateContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const Line = styled.div<{ $per?: number }>`
  width: ${(props) => (props.$per ? `${props.$per}%` : "100%")};
  height: 8px;
  margin-bottom: 3px;
  border-right: 1px solid #ffffff;
`;

const Container = styled.div<{ $per?: number; $maxPer?: number }>`
  display: flex;
  justify-content: space-between;
  text-decoration: row;
  border-radius: 8px;
  ${(props) =>
    props.$per ? css({ border: `1px solid ${props.theme.colors.border.barChart}` }) : null};
  background: ${(props) => {
    if (props.$per) {
      const left =
        props.$per >= 100 - props.$maxPer
          ? props.theme.colors.barChart.primary
          : props.theme.colors.barChart.warning;
      const right = props.theme.colors.barChart.secondary;
      return `linear-gradient(to right, ${left}, ${left} ${props.$per}%, ${right} ${props.$per}%, ${right} 100%)`;
    }
  }};
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: space-between;
  text-decoration: row;
`;

const BarChartText = styled(H4)`
  padding: 0px 5px;
`;

const ChartLabel = styled(H5)`
  margin-bottom: 0;
  margin-top: 3px;
`;

export default StakingRate;
