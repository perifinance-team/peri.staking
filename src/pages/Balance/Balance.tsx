import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import { H1, H4 } from "components/heading";
import { StyledTHeader, StyledTBody, Row, Cell, BorderRow } from "components/table";
import { formatCurrency } from "lib";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Escrow from "pages/Escrow";
import Liquidation from "pages/Liquidation";
import Vesting from "pages/Vesting";
import PynthsBalance from "./PynthsBalance";

const Balance = () => {

  const { address, networkId } = useSelector((state: RootState) => state.wallet);
  const { balances, isReady } = useSelector((state: RootState) => state.balances);
  const swapName = {
    1: "UNI",
    3: "UNI",
    4: "UNI",
    5: "UNI",
    42: "UNI",
    56: "PANCAKE",
    97: "PANCAKE",
    137: "QUICK",
    80001: "QUICK",
  };

  return (
    <Router basename="/balance">
      <Switch>
        <Route exact path="/">
          <Container>
            <Title>
              <H1>TOTAL BALANCE</H1>
            </Title>
            <TableContainer>
              <BalanceContainer $isLoading={!isReady}>
                <TableHeader>
                  <Row>
                    <TokenCell>
                      <H4 $weight={"b"} $align={"center"}>
                        Asset
                      </H4>
                    </TokenCell>
                    <AmountCell>
                      <H4 $weight={"b"}>Staked</H4>
                    </AmountCell>
                    <AmountCell>
                      <H4 $weight={"b"}>Stakeable</H4>
                    </AmountCell>
                    <AmountCell>
                      <H4 $weight={"b"}>Transferable</H4>
                    </AmountCell>
                    <AmountCell>
                      <H4 $weight={"b"}>Escrow</H4>
                    </AmountCell>
                    <AmountCell>
                      <H4 $weight={"b"}>Total</H4>
                    </AmountCell>
                  </Row>
                </TableHeader>
                <TableBody $isLoading={!isReady} >
                  {address ? isReady 
                  ? Object.keys(balances).map((currencyName) => {
                    if ((networkId === 1287 || networkId === 1285) && currencyName === "LP")
                      return <></>;
                    else
                      return (
                        <BorderRow key={currencyName}>
                          <TokenCell>
                            <Asset $isLP={currencyName === "LP"}>
                              <img
                                src={`/images/currencies/${
                                  currencyName === "LP"
                                    ? `${currencyName}_${swapName[networkId]}.png`
                                    : `${currencyName}.png`
                                }`}
                                alt="lp"
                              ></img>
                              <H4 $weight={"m"} $align={"left"}>
                                {currencyName}
                              </H4>
                            </Asset>
                          </TokenCell>
                          <AmountCell>
                            <H4 $weight={"m"} $align={"right"}>
                              {formatCurrency(balances[currencyName].staked)}
                            </H4>
                          </AmountCell>
                          <AmountCell>
                            <H4 $weight={"m"} $align={"right"}>
                              {formatCurrency(balances[currencyName].stakeable)}
                            </H4>
                          </AmountCell>
                          <AmountCell>
                            <H4 $weight={"m"} $align={"right"}>
                              {formatCurrency(balances[currencyName].transferable)}
                            </H4>
                          </AmountCell>
                          <AmountCell>
                            <H4 $weight={"m"} $align={"right"}>
                              {formatCurrency(balances[currencyName].rewardEscrow)}
                            </H4>
                          </AmountCell>
                          <AmountCell>
                            <H4 $weight={"m"} $align={"right"}>
                              {formatCurrency(balances[currencyName].balance)}
                            </H4>
                          </AmountCell>
                        </BorderRow>
                      );
                    })
                  : <TableLoadingSpinner />
                  : null}
                </TableBody>
              </BalanceContainer>
              <PynthsBalance />
            </TableContainer>
          </Container>
        </Route>
        <Route exact path="/escrow">
          <Escrow />
        </Route>
        <Route exact path="/liquidation">
          <Liquidation />
        </Route>
        <Route exact path="/vesting">
          <Vesting />
        </Route>
      </Switch>
    </Router>
  );
};

export const TableLoadingSpinner = styled.div`
	width: 40px;
	height: 40px;
	border: 2px solid #262a3c;
	border-radius: 50%;
	border-top-color: #4182f0;
	border-left-color: #4182f0;
	border-right-color: #4182f0;
	margin: 30px;
	animation: spin 0.8s infinite ease-in-out;

	@keyframes spin {
		to {
			transform: rotate(1turn);
		}
	}

  @media only screen and (max-width: 510px) {
    width: 15px;
    height: 15px;
    margin: 5px;
  }
`;

export const BalanceContainer = styled.div<{ $isLoading?: boolean }>`
  z-index: 1;
  display: flex;
  flex-direction: column;
  // align-items: center;
  min-height: 65%;
  height: fit-content;
  align-items: ${(props) => (props.$isLoading ? "center" : "flex-start")};
  width: 100%;

  @media only screen and (max-width: 510px) {
    width: fit-content;
  }
`;

export const AmountCell = styled(Cell)`
  width: 17.5% !important;

  @media only screen and (max-width: 510px) {
    min-width: 72px;
  }
`;

export const TokenCell = styled(Cell)`
  flex-direction: row;
  width: 12.5% !important;
  justify-content: center !important;
  position: relative !important;
  ${({ theme }) => theme.media.mobile`
    min-width: 40px;
  `}
`;

export const Asset = styled.div<{ $isLP?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100% !important;

  img {
    width: ${(props) => (props.$isLP ? "32px" : "20px")};
    height: 20px;
  }
  ${({ theme }) => theme.media.mobile`
    flex-direction: column;
    align-tiems: center;

    h4 {
      // width: 100%;
      font-size: 9px;
      text-align: center;
    }
  `}
`;

export const TableHeader = styled(StyledTHeader)`
  max-height: 50px;
  ${({ theme }) => theme.media.mobile`
    width: 100%;
  `}

  @media only screen and (max-width: 510px) {
    width: fit-content;
  }
`;

const TableBody = styled(StyledTBody)<{ $isLoading?: boolean }>`
  width: 100%;
  height: ${(props) => (props.$isLoading ? "50% !important" : "fit-content")};
  align-items: ${(props) => (props.$isLoading ? "center" : "flex-start")};
  justify-content: ${(props) => (props.$isLoading ? "center" : "flex-start")};

  @media only screen and (max-width: 510px) {
    width: fit-content;
  }
`;

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  // position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  ${({ theme }) => theme.media.mobile`
		// height: 45vh;
    // justify-content: center;
	`}
`;

const Title = styled.div`
  z-index: 0;
  justify-content: flex-start;

  h1 {
    width: fit-content;
    // margin-left: 70px;
  }
`;

const TableContainer = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 10px;
  height: 60%;
  width: 80%;
  max-height: 85%;
  overflow-y: auto;
  // top: -40px;
  // padding: 50px 40px;
  background-color: ${(props) => props.theme.colors.background.body};
  box-shadow: ${(props) => `0px 0px 25px ${props.theme.colors.border.primary}`};
  border: ${(props) => `2px solid ${props.theme.colors.border.primary}`};


  ${({ theme }) => theme.media.mobile`
      margin: 0;
      width: 90%;
      height: fit-content;
      min-height: 87%;
      overflow-y: scroll;
      overflow-x: scroll;
      padding: 0;
      border-radius: 5px;
  `}

  ${({ theme }) => theme.media.tablet`
    width: 85%;
    height: 85%;
  `}

`;


export default Balance;
