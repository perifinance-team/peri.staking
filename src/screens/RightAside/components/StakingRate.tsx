import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { H4 } from "components/heading";
import { useEffect, useState } from "react";

const StakingRate = () => {
  const balancesIsReady = useSelector(
    (state: RootState) => state.balances.isReady
  );
  const exchangeIsReady = useSelector(
    (state: RootState) => state.exchangeRates.isReady
  );
  const { balances } = useSelector((state: RootState) => state.balances);
  const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
  const [PERIStakingPer, setPERIStakingPer] = useState(0);

  useEffect(() => {
    if (balances["DEBT"]?.PERI && exchangeIsReady && balancesIsReady) {
      const periDebt = balances["PERI"].staked * exchangeRates["PERI"];
      const daiDebt = balances["DAI"].staked * exchangeRates["DAI"];
      const usdcDebt = balances["USDC"].staked * exchangeRates["USDC"];
      const total = periDebt + daiDebt + usdcDebt;

      const per =
        total === 0n ? 0 : (BigInt(daiDebt + usdcDebt) * 100n) / total;
      setPERIStakingPer(Math.ceil(Number(per.toString())));
    }
  }, [balances, exchangeIsReady, balancesIsReady]); // , exchangeRates

  return (
    <>
      {balances["DEBT"]?.PERI > 0 && (
        <>
          <Line></Line>
          <Container per={100 - PERIStakingPer}>
            <BarChartText align={"left"}>{100 - PERIStakingPer}%</BarChartText>
            <BarChartText align={"right"}>{PERIStakingPer}%</BarChartText>
          </Container>
          <Container>
            <H4 align={"left"}>Peri</H4>
            <H4 align={"right"}>Stable</H4>
          </Container>
        </>
      )}
    </>
  );
};
const Line = styled.div`
  width: 80%;
  height: 8px;
  margin-bottom: 3px;
  border-right: 1px solid #ffffff;
`;

const Container = styled.div<{ per?: number }>`
  display: flex;
  justify-content: space-between;
  text-decoration: row;
  border-radius: 8px;
  ${(props) =>
    props.per
      ? css({ border: `1px solid ${props.theme.colors.border.barChart}` })
      : null};
  margin-bottom: 15px;
  background: ${(props) => {
    if (props.per) {
      const left =
        props.per >= 80
          ? props.theme.colors.barChart.primary
          : props.theme.colors.barChart.warning;
      const right = props.theme.colors.barChart.secondary;
      return `linear-gradient(to right, ${left}, ${left} ${props.per}%, ${right} ${props.per}%, ${right} 100%)`;
    }
  }};
`;

const BarChartText = styled(H4)`
  padding: 0px 5px;
`;

export default StakingRate;
