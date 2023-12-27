import React from "react";
import styled from "styled-components";
import StakingStatus from "./components/StakingStatus";
import FitToClaimable from "./components/FitToClaimable";
import Refresh from "./components/Refresh";
import Exit from "./components/Exit";
import StakingRate from "./components/StakingRate";
import { useLocation } from "react-router-dom";

const RightAside = () => {
  const location = useLocation();

  return (
    <Aside $isHide={location.pathname.includes("/balance")}>
      <Container>
        <MainContainer>
          <FlexRow>
            <Refresh></Refresh>
            <Exit></Exit>
          </FlexRow>
          <FitToClaimable></FitToClaimable>
          {/* <DebtBalance></DebtBalance>
          <Ratios></Ratios> */}
          <StakingRate></StakingRate>
          <StakingStatus></StakingStatus>
        </MainContainer>
      </Container>
    </Aside>
  );
};

const Aside = styled.aside<{ $isHide?: boolean }>`
  width: 22vw;
  ${({ theme }) => theme.media.tablet`
    width: 100%;
    height: 40%;
  `}

  ${({ theme }) => theme.media.mobile`
    width: 100%;
    height: 40%;
  `}

/*   ${({ theme, $isHide }) => ($isHide ? theme.media.tablet`display: none;` : null)}

  ${({ theme, $isHide }) => ($isHide ? theme.media.mobile`display: none;` : null)} */
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;

  // ${({ theme }) => theme.media.mobile`
  //   position: relative;
  // `}
`;

const FlexRow = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MainContainer = styled.div`
  display: flex;
  padding-top: 30px;
  flex-direction: column;
  align-items: flex-start;
  width: 85%;
  min-width: 200px;
  // margin: 0 30px;
  // margin: 0 60px 0 0;

  // padding: 0 60px 0 0;

  ${({ theme }) => theme.media.mobile`
    padding-top: 10px;
    margin-top: 0;
    margin: 0 5%;
    width: 95%;
    min-width: 240px;
  `}

  ${({ theme }) => theme.media.tablet`
    margin-top: 0;
    margin: 0 5%;
    width: 95%;

  `}
`;

export default RightAside;
