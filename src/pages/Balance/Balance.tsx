import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import { H1, H4 } from "components/headding";
import {
  StyledTHeader,
  StyledTBody,
  Row,
  Cell,
  BorderRow,
} from "components/Table";
import { formatCurrency } from "lib";
const Balance = () => {
  const { balances } = useSelector((state: RootState) => state.balances);
  const { networkId } = useSelector((state: RootState) => state.wallet);
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
    <Container>
      <Title>
        {" "}
        <H1>TOTAL BALANCE</H1>{" "}
      </Title>
      <TableContainer>
        <StyledTHeader>
          <Row>
            <Cell>
              <H4 weigth={"b"} align={"center"}>
                COIN
              </H4>
            </Cell>
            <AmountCell>
              <H4 weigth={"b"}>STAKED</H4>
            </AmountCell>
            <AmountCell>
              <H4 weigth={"b"}>STAKABLE</H4>
            </AmountCell>
            <AmountCell>
              <H4 weigth={"b"}>TRANSFERABLE</H4>
            </AmountCell>
            <AmountCell>
              <H4 weigth={"b"}>REWARD ESCROW</H4>
            </AmountCell>
            <AmountCell>
              <H4 weigth={"b"}>TOTAL</H4>
            </AmountCell>
          </Row>
        </StyledTHeader>
        <StyledTBody>
          {Object.keys(balances).map((currencyName) => {
            if (
              (networkId === 1287 || networkId === 1285) &&
              currencyName === "LP"
            )
              return;
            else
              return (
                <BorderRow key={currencyName}>
                  <AssetCell>
                    <Asset isLP={currencyName === "LP"}>
                      <img
                        src={`/images/currencies/${
                          currencyName === "LP"
                            ? `${currencyName}_${swapName[networkId]}.png`
                            : `${currencyName}.png`
                        }`}
                        alt="lp"
                      ></img>
                      <H4 weigth={"m"} align={"left"}>
                        {currencyName}
                      </H4>
                    </Asset>
                  </AssetCell>
                  <AmountCell>
                    <H4 weigth={"m"} align={"right"}>
                      {formatCurrency(balances[currencyName].staked)}
                    </H4>
                  </AmountCell>
                  <AmountCell>
                    <H4 weigth={"m"} align={"right"}>
                      {formatCurrency(balances[currencyName].stakable)}
                    </H4>
                  </AmountCell>
                  <AmountCell>
                    <H4 weigth={"m"} align={"right"}>
                      {formatCurrency(balances[currencyName].transferable)}
                    </H4>
                  </AmountCell>
                  <AmountCell>
                    <H4 weigth={"m"} align={"right"}>
                      {formatCurrency(balances[currencyName].rewardEscrow)}
                    </H4>
                  </AmountCell>
                  <AmountCell>
                    <H4 weigth={"m"} align={"right"}>
                      {formatCurrency(balances[currencyName].balance)}
                    </H4>
                  </AmountCell>
                </BorderRow>
              );
          })}
        </StyledTBody>
      </TableContainer>
    </Container>
  );
};
const AssetCell = styled(Cell)`
  width: 120px;
  margin-left: 10px;
`;

const AmountCell = styled(Cell)`
  max-width: 100%;
  padding: 5px 15px;
`;

const Asset = styled.div<{ isLP?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  h4 {
    margin-left: 10px;
  }
  img {
    width: ${(props) => (props.isLP ? "32px" : "20px")};
    height: 20px;
  }
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  margin-left: 100px;
  position: absolute;
  z-index: 0;
  top: 10%;
`;

const TableContainer = styled.div`
  z-index: 1;
  border-radius: 25px;
  height: 40%;
  margin: 0 70px;
  padding: 50px 40px;
  background-color: ${(props) => props.theme.colors.background.panel};
  box-shadow: ${(props) => `0px 0px 25px ${props.theme.colors.border.primary}`};
  border: ${(props) => `2px solid ${props.theme.colors.border.primary}`};
`;

export default Balance;
