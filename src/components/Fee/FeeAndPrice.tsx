import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import { H5 } from "components/heading";
import { formatCurrency } from "lib";

export const FeeAndPrice = ({ currencyName = "PERI" }) => {
  const { gasPrice } = useSelector((state: RootState) => state.networkFee);
  const exchangeRates = useSelector((state: RootState) => state.exchangeRates);

  return (
    <FeeContainer>
      <H5 align={"left"} color={"primary"}>
        network fees : {(gasPrice / 1000000000n).toString()} GWEI
      </H5>
      <H5 align={"right"} color={"primary"}>
        {currencyName} price : $ {formatCurrency(exchangeRates[currencyName])}
      </H5>
    </FeeContainer>
  );
};

const FeeContainer = styled.div`
  width: 320px;
  margin: 0px 20px 0px 0px;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  vertical-align: middle;
`;
