import React from "react";
import styled from "styled-components";

import DebtBalance from "./components/DebtBalance";
import Ratios from "./components/Ratios";
import StakingRate from "./components/StakingRate";
import StakingStatus from "./components/StakingStatus";
import FitToClaimable from "./components/FitToClaimable";
import Refresh from "./components/Refresh";
import Exit from "./components/Exit";

const RightAside = () => {
  return (
    <Aside>
      <Container>
        <DebtBalance></DebtBalance>
        <Ratios></Ratios>
        <StakingRate></StakingRate>
        <FitToClaimable></FitToClaimable>
        <StakingStatus></StakingStatus>
        <FelxRow>
          <Refresh></Refresh>
          <Exit></Exit>
        </FelxRow>
      </Container>
    </Aside>
  );
};

const Aside = styled.aside``;

const FelxRow = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  margin-top: 10vh;
  flex-direction: column;
  min-width: 240px;
  padding: 0 60px 0 0;
  @media only screen and (max-height: 900px) {
    margin-top: 0;
  }
`;

export default RightAside;
