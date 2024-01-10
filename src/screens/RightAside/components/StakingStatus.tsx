import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { H4, SmallLoadingSpinner } from "components/heading";
import { formatCurrency } from "lib";
import { useEffect, useState } from "react";
const StakingStatus = () => {
  const { isConnect } = useSelector((state: RootState) => state.wallet);
  const { balances } = useSelector((state: RootState) => state.balances);
  const balancesIsReady = useSelector((state: RootState) => state.balances.isReady);

  const [PERIStatus, setPERIStatus] = useState({
    staked: 0n,
    stakeable: 0n,
  });

  const [USDCStatus, setUSDCStatus] = useState({
    staked: 0n,
    stakeable: 0n,
  });

  const [DAIStatus, setDAIStatus] = useState({
    staked: 0n,
    stakeable: 0n,
  });

  useEffect(() => {
    if (balancesIsReady) {
      setPERIStatus({
        staked: balances["PERI"].staked,
        stakeable: balances["PERI"].stakeable,
      });

      setUSDCStatus({
        staked: balances["USDC"].staked,
        stakeable: balances["USDC"].stakeable,
      });

      setDAIStatus({
        staked: balances["DAI"].staked,
        stakeable: balances["DAI"].stakeable,
      });
      // const USDCBalanceToUSD = balances['USDC'].transferable * exchangeRates['USDC'] / BigInt(Math.pow(10, 18).toString());
      // const DAIBalanceToUSD = balances['DAI'].transferable * exchangeRates['DAI'] / BigInt(Math.pow(10, 18).toString());
      // const TotalStableUSD = USDCBalanceToUSD + DAIBalanceToUSD;

      // let mintableStable = ((balances['DEBT'].PERI / 4n) - (balances['DEBT'].stable));
      // mintableStable = mintableStable <= 0n ? 0n : mintableStable * 4n;

      // setStableStatus({
      //     staked: balances['DEBT'].stable * 4n,
      //     stakeable: mintableStable < TotalStableUSD ? mintableStable : TotalStableUSD,
      // });
    }
  }, [balancesIsReady, balances]);
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
      <Container>
        <Image>
          <img src={`/images/currencies/PERI.png`} alt="lp"></img>
        </Image>
        <Box>
          {isConnect ? (
            balancesIsReady ? (
              <H4 $align={"right"}> {formatCurrency(PERIStatus.staked)}</H4>
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
              <H4 $align={"right"}>{formatCurrency(PERIStatus.stakeable)}</H4>
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
      </Container>
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

export default StakingStatus;
