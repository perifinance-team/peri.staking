import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { networkInfo } from "configure/networkInfo";
import { createCompareFn, formatCurrency } from "lib";
import { getPynthBalances } from "lib/thegraph/api/getPynthBalances";
import { RootState } from "config/reducers";
import { Cell, Row, StyledTHeader, BorderRow } from "components/table";
import { H4 } from "components/heading";
import { TokenCell, Asset, TableLoadingSpinner } from "./Balance";
import { clearPynths, updatePynths } from "config/reducers/wallet";
import { TableHeader } from "pages/Liquidation/Liquidation";
import pynths from "configure/coins/pynths";

const PynthsBalance = () => {
  const dispatch = useDispatch();
  const { pynthBalances } = useSelector((state: RootState) => state.balances);
  const { networkId, address } = useSelector((state: RootState) => state.wallet);
  
  const fetchPynthBalances = async () => {
    console.log(networkId, address);
    if (networkInfo[networkId] === undefined || !address) return;

    dispatch(clearPynths());
    const balances = await getPynthBalances({ networkId: networkId.toString(), address });

    console.log(balances);

    if (Array.isArray(balances)) {
      balances.sort(createCompareFn("usdBalance", "desc"));
      dispatch(updatePynths(balances));
    }

  };

  useEffect(() => {
    fetchPynthBalances();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId, address]);

  return (
    <Container>
      {pynths[networkId]
        ? pynthBalances.length === 0 
        ? <PynthHederRow $isLoading={ pynths[networkId] && pynthBalances.length === 0 }>
            <TableLoadingSpinner/>
          </PynthHederRow>
        : <PynthTableContainer key="pynthTable">
            <PynthHederRow />
            <TableHeader>
              <Row>
                <TokenCell>
                  <H4 $weight={"b"} $align={"center"}>
                    Pynth
                  </H4>
                </TokenCell>
                <PynthAmtCell>
                  <H4 $weight={"b"}>Amount</H4>
                </PynthAmtCell>
                <PynthAmtCell>
                  <H4 $weight={"b"}>Value(USD)</H4>
                </PynthAmtCell>
              </Row>
            </TableHeader>
            <PynthTableBody>
              {pynthBalances.map((pynth, index) => {
                return (
                  (pynth.usdBalance > 0) && <BorderRow key={index}>
                    <TokenCell>
                      <Asset>
                        <img src={`/images/currencies/${pynth.currencyName}.svg`} alt={`${pynth.currencyName}`}></img>
                        <H4 $weight={"m"} $align={"left"}>
                          {pynth.currencyName}
                        </H4>
                      </Asset>
                    </TokenCell>
                    <PynthAmtCell>
                      <H4 $weight={"m"} $align={"right"}>
                        {formatCurrency(pynth.amount)}
                      </H4>
                    </PynthAmtCell>
                    <PynthAmtCell>
                      <H4 $weight={"m"} $align={"right"}>
                        {formatCurrency(pynth.usdBalance)}
                      </H4>
                    </PynthAmtCell>
                  </BorderRow>
                );
              })}
            </PynthTableBody>
          </PynthTableContainer>
        : null
      }
    </Container>
      
  );
};

const PynthHederRow = styled(Row)<{ $isLoading?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(props) => (props.$isLoading ? "40%" : "20px")};

  @media only screen and (max-height: 510px) {
    width: 510px;
  }
`;

const PynthAmtCell = styled(Cell)`
  width: 45% !important;

  // @media only screen and (max-height: 510px) {
  //   min-width: 190px;
  // }
`;

const PynthTableBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  overflow-y: visible;
  width: 100%;
  height: 100%;

  @media only screen and (max-height: 510px) {
    height: fit-content;
  }

`;

const Container = styled.div`
  z-index: 1;
  width: 100%;
  height: fit-content;
  min-height: 50%;
`;

const PynthTableContainer = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
`;


export default PynthsBalance;