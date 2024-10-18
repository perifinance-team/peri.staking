import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { H4 } from "components/heading";

const Ratios = () => {
  const { targetCRatio, liquidationRatio } = useSelector(
    (state: RootState) => state.ratio
  );

  // const { liquidation } = useSelector((state: RootState) => state.liquidation);

  const ratioToPer = (value: bigint) => {
    const bnValue = BigInt(value);
    if (bnValue === 0n) return "0";
    return ((BigInt(Math.pow(10, 18).toString()) * 100n) / bnValue).toString();
  };

  // const onLiquidHandler = () => {
  //   dispatch(toggleNoti({ toggle: true, title: 1 }));
  // };

  return (
    <Container>
      <Row $width="38%">
        <H4 $weight={"sm"} $color={"sixth"}>
          Target
        </H4>
        <RatioLabel $color={"fourth"}>{ratioToPer(targetCRatio)}%</RatioLabel>
      </Row>
      <Row $width="58%">
        <H4 $weight={"sm"} $color={"sixth"}>
          Liquidation
        </H4>
        <RatioLabel $color={"fourth"}>{ratioToPer(liquidationRatio)}%</RatioLabel>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  width: 40%;
  min-width: 220px;
  flex-direction: row;

  ${({ theme }) => theme.media.mobile`
    width: 100%;
  `}

  ${({ theme }) => theme.media.tablet`
    min-width: 200px;
  `}
`;

const Row = styled.div<{ $width?: string }>`
  width: ${({ $width }) => ($width ? $width : "50%")};
  margin: 0px 10px 0px 10px;
  display: flex;
  flex-direction: row;

  justify-content: center;

  h4 {
    display: flex;
    justify-content: center;
    flex-rap: nowrap;
  }

  ${({ theme }) => theme.media.tablet`
    flex-wrap: wrap;
  `}
`;

const RatioLabel = styled(H4)`
  margin: 0px 20px;
  display: flex;
  font-weight: 800;
  justify-content: flex-start;
`;

// const LiquidationBtn = styled.button<{ $isShow?: boolean; }>`
//   display: ${(props) => (props.$isShow ? "flex" : "none")};
//   justify-content: center;
//   align-items: center;
//   width: 1rem;
//   height: 1rem;
//   border-radius: 50%;
//   border: none;
//   outline: none;
//   background: ${(props) => props.theme.colors.font["warning"]};
//   left: 0px;
//   top: 2px;
//   font-weight: bold;
//   cursor: pointer;
//   margin-right: 5px;
// `;

export default Ratios;
