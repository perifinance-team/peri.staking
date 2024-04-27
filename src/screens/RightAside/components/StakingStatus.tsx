import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { H4, SmallLoadingSpinner } from "components/heading";
import { formatCurrency } from "lib";
// import { useEffect, useState } from "react";
const StakingStatus = () => {
  const { isConnect } = useSelector((state: RootState) => state.wallet);
  const { balances, isLoading } = useSelector((state: RootState) => state.balances);
  // const balancesIsReady = useSelector((state: RootState) => state.balances.isReady);

  return (
    <>
      <Container>
        <Box $width={"45%"}>
          <H4 $color={"fourth"} $weight={"sb"}>
            Staked
          </H4>
        </Box>
        <Box $width={"45%"}>
          <H4 $color={"fourth"}>Stakeable</H4>
        </Box>
      </Container>
      {Object.keys(balances).map(
        (token) => 
        (token !== "DEBT" && token !== "pUSD" && token !== "LP") &&
        <Container key={token}>
          <Image>
            <img src={`/images/currencies/${token}.png`} alt="lp"></img>
          </Image>
          <Box>
            {isConnect ? (
              !isLoading ? (
                <H4 $align={"right"}> {formatCurrency(balances[token].staked)}</H4>
              ) : (
                <SmallLoadingSpinner />
              )
            ) : (
              <H4 $align={"right"}></H4>
            )}
          </Box>
          <Box>
            {isConnect ? (
              !isLoading ? (
                <H4 $align={"right"}>{formatCurrency(balances[token].stakeable)}</H4>
              ) : (
                <SmallLoadingSpinner />
              )
            ) : (
              <H4 $align={"right"}></H4>
            )}
          </Box>
        </Container>
      )}
      <Container>
        <BannerBox>
          <img src={`/images/banners/peri-dex1.svg`} onClick={()=>{window.open("https://dex.peri.finance/")}} alt="PERI Finance's Dex"></img>
        </BannerBox>
      </Container>
      {/* <Container>
        <Image>
          <img src={`/images/currencies/USDC.png`} alt="lp"></img>
        </Image>
        <Box>
          {isConnect ? (
            balancesIsReady ? (
              <H4 $align={"right"}>{formatCurrency(USDCStatus.staked)}</H4>
            ) : (
              <SmallLoadingSpinner />
            )
          ) : (
            <H4 $align={"right"}></H4>
          )}
        </Box>
        <Box>
          {isConnect ? (
            balancesIsReady ? (
              <H4 $align={"right"}>{formatCurrency(USDCStatus.stakeable)}</H4>
            ) : (
              <SmallLoadingSpinner />
            )
          ) : (
            <H4 $align={"right"}></H4>
          )}
        </Box>
      </Container>
      <Container>
        <Image>
          <img src={`/images/currencies/DAI.png`} alt="lp"></img>
        </Image>
        <Box>
          {isConnect ? (
            balancesIsReady ? (
              <H4 $align={"right"}>{formatCurrency(DAIStatus.staked)}</H4>
            ) : (
              <SmallLoadingSpinner />
            )
          ) : (
            <H4 $align={"right"}></H4>
          )}
        </Box>
        <Box>
          {isConnect ? (
            balancesIsReady ? (
              <H4 $align={"right"}>{formatCurrency(DAIStatus.stakeable)}</H4>
            ) : (
              <SmallLoadingSpinner />
            )
          ) : (
            <H4 $align={"right"}></H4>
          )}
        </Box>
      </Container> */}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 10px 0px;
  display: flex;
  justify-content: space-between;
  img {
    width: 20px;
    height: 20px;
  }
`;
const Image = styled.div`
  flex: 1;
  padding: 0px 5px;
`;

const Box = styled.div<{ $width?: string }>`
  flex: 5;
  padding: 0px 5px;
  width: ${(props) => (props.$width ? props.$width : "auto")};
`;

const BannerBox = styled.div`
  flex: 1;
  box-shadow: ${(props) => `0.5px 1px 0px ${props.theme.colors.border.primary}`};
  border: ${(props) => `0.1px solid ${props.theme.colors.background.button.fifth}`};
  border-radius: 5px;
  z-index: 0;
  
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 4px;
    object-fit: cover;
  }
`;

export default StakingStatus;
