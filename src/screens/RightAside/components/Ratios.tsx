import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { H3 } from "components/headding";
import { utils } from "ethers";
import { toggleNoti } from "config/reducers/liquidation";

const Ratios = () => {
  const dispatch = useDispatch();
  const { targetCRatio, currentCRatio, liquidationRatio } = useSelector(
    (state: RootState) => state.ratio
  );
  const { liquidation } = useSelector((state: RootState) => state.liquidation);

  const ratioToPer = (value) => {
    if (value === 0n) return "0";
    return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
  };

  // ! 체인에서 대상여부 판단할거라 생각해서 주석처리
  //   const [liquidator, setLiquidator] = useState(false);

  //   useEffect(() => {
  //     if (Number(ratioToPer(currentCRatio)) < 150) {
  //       setLiquidator(true);
  //       dispatch(toggleLiquid({ liquidation: true }));
  //     } else {
  //       setLiquidator(false);
  //       dispatch(toggleLiquid({ liquidation: false }));
  //     }
  //   }, [currentCRatio, dispatch]);

  const onLiquidHandler = () => {
    dispatch(toggleNoti({ toggle: true, title: 1 }));
  };

  return (
    <Container>
      <Row style={{ position: "relative" }}>
        {liquidation && (
          <LiquidationBtn onClick={() => onLiquidHandler()}>!</LiquidationBtn>
        )}
        <H3 weigth={"sm"}>C-Ratio</H3>
        <H3 weigth={"eb"} color={liquidation ? "warning" : "fourth"}>
          {ratioToPer(currentCRatio)}%
        </H3>
      </Row>
      <Row>
        <H3 weigth={"sm"}>Target</H3>
        <H3 weigth={"eb"} color={"fourth"}>
          {ratioToPer(targetCRatio)}%
        </H3>
      </Row>
      <Row>
        <H3 weigth={"sm"}>Liquidation</H3>
        <H3 weigth={"eb"} color={"fourth"}>
          {ratioToPer(liquidationRatio)}%
        </H3>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  margin: 0px 0px 15px 0px;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  margin: 20px 0px 0px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LiquidationBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  outline: none;
  background: ${(props) => props.theme.colors.font["warning"]};
  position: absolute;
  left: -24px;
  top: 2px;
  font-weight: bold;
  cursor: pointer;
`;

export default Ratios;
