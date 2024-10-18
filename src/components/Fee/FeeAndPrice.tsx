import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import { H5 } from "components/heading";
import { formatCurrency } from "lib";
import { getExchangeRatesLP } from "lib/rates";

export const FeeAndPrice = ({ currencyName = "PERI" }) => {
  const { gasPrice } = useSelector((state: RootState) => state.networkFee);
  const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
  const { networkId } = useSelector((state: RootState) => state.wallet);
  const [lpPrice, setLPPrice] = React.useState(0n);


  useEffect(() => {
    getExchangeRatesLP(networkId).then(({ PERIBalance, PoolTotal }) => {
      PoolTotal ? setLPPrice(PERIBalance * 2n * exchangeRates["PERI"] / PoolTotal)
      : setLPPrice(0n);
    });
  }, [exchangeRates, networkId]);


  return (
    <FeeContainer>
      <H5 $align={"left"} color={"primary"}>
        Fee : {(gasPrice / 1000000000n).toString()} GWEI
      </H5>
      <H5 $align={"right"} color={"primary"}>
      {currencyName} : $ {
          currencyName === "LP" 
          ? formatCurrency(lpPrice)
          : formatCurrency(exchangeRates[currencyName])} 
      </H5>
    </FeeContainer>
  );
};

const FeeContainer = styled.div`
  width: 95%;
  margin: 0px 10px 0px 0px;
  display: flex;
  justify-content: space-between;
  vertical-align: middle;

  ${({ theme }) => theme.media.mobile`
    // width: 260px;
    width: 75%;
    margin: 0px;

    h5 {
      font-size: 8px;
      font-weight: 600;
    }
  `}

  h5 {
    margin: 5px 0px;
  }
`;
