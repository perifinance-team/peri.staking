import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { H4 } from "components/heading";
import { formatCurrency } from "lib";
import Timer from "components/Timer";
import { BaseContainer } from "components/container";
import { toggleNoti } from "config/reducers/liquidation";
import { fromBigInt } from "lib/etc/utils";

const DebtBalance = () => {
  const dispatch = useDispatch();
  const { balances } = useSelector((state: RootState) => state.balances);
  const { liquidation } = useSelector((state: RootState) => state.liquidation);
  const { isConnect } = useSelector((state: RootState) => state.wallet);
  const { currentCRatio } = useSelector((state: RootState) => state.ratio);

  const ratioToPer = (value: bigint) => {
    if (value === 0n) return "0";
    // console.log("ratio", value);
    return Math.round((1 / Number(fromBigInt(value))) * 100).toString();
  };

  const onLiquidHandler = () => {
    dispatch(toggleNoti({ toggle: true, title: 1 }));
  };

  const [flag, setFlag] = useState(false);

  const isUnderLiquidation = () => {
    const ratio = Number(ratioToPer(currentCRatio));
    return ratio > 0 && ratio <= 150;
  };

  useEffect(() => {
    // console.log("currentCRatio", currentCRatio, "ratioToPer", Number(ratioToPer(currentCRatio)));
    currentCRatio && setFlag(isConnect && Number(ratioToPer(currentCRatio)) <= 150 && liquidation);
    // return () => {
    //   console.log("currentCRatio", currentCRatio, "ratioToPer", Number(ratioToPer(currentCRatio)));
    //   setFlag(isConnect && Number(ratioToPer(currentCRatio)) <= 150 && liquidation);
    //   // setFlag(true);
    // };
  }, [isConnect, currentCRatio, liquidation]);

  return (
    <DebtBalanceContainer>
      <CRatioContainer>
        <CRatioInfoLabel>
          <LiquidationBtn $isShow={isUnderLiquidation()} onClick={() => onLiquidHandler()}>
            !
          </LiquidationBtn>
          <H4 $weight={"sm"} $color={"sixth"}>
            C-Ratio
          </H4>
        </CRatioInfoLabel>
        <RatioLabel $color={isUnderLiquidation() ? "warning" : "fourth"}>
          {ratioToPer(currentCRatio)}%
        </RatioLabel>
      </CRatioContainer>
      <BalanceContainer>
        <H4 $weight={"sm"} $color={"sixth"}>
          ActiveDebt
        </H4>
        <BalanceLabel $height={"inherit"}>
          <PusdImgSpan>
            <img alt={"pUSD"} src={`/images/currencies/pUSD.png`} />
          </PusdImgSpan>
          <DebtAmountH4 $align={"right"} $color={"sixth"}>
            {formatCurrency(balances["DEBT"]?.balance ? balances["DEBT"]?.balance : 0n)}
          </DebtAmountH4>
        </BalanceLabel>
      </BalanceContainer>
      {flag && <Timer />}
    </DebtBalanceContainer>
  );
};
const DebtBalanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  width: 60%;
  min-width: 200px;
  flex: 1 1 auto;
  padding-left: 20px;
  justify-content: flex-start;
  ${({ theme }) => theme.media.tablet`
    width: 60%;
    min-width: 200px;
  `}

  ${({ theme }) => theme.media.mobile`
    width: 100%;
    flex-wrap: wrap;
    padding-left: 0px;
    order: 2;
  `}
`;

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  width: 33%;
  flex: 1 1 auto;
  flex-direction: row;
  justify-content: center;
  margin: 0px 10px;

  ${({ theme }) => theme.media.mobile`
    width: 62%;
    order: last;
    margin: 0;
  `}

  ${({ theme }) => theme.media.tablet`
    flex-wrap: wrap;
  `}
`;

const BalanceLabel = styled(BaseContainer)`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  // flex: 1 1 auto;

  ${({ theme }) => theme.media.mobile`
    flex: none;
    width: 50%;
    justify-content: center;
  `}

  ${({ theme }) => theme.media.tablet`
    justify-content: center;
  `}
`;

const PusdImgSpan = styled.span`
  display: flex;
  height: 20px;
  width: 20px;
  margin-right: 10px;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
  img {
    width: 20px;
    height: 20px;
  }

  ${({ theme }) => theme.media.mobile`
    width: 14px;
    margin: 0 5px;
    img {
      width: 14px;
      height: 14px;
    }
  `}

  ${({ theme }) => theme.media.tablet`
    img {
      width: 16px;
      height: 16px;
    }
  `}
`;

const DebtAmountH4 = styled(H4)`
  display: flex;
  width: fit-content;
  height: 20px;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  font-weight: 700;

  ${({ theme }) => theme.media.mobile`
    width: 45%;
    justify-content: flex-start;
  `}
`;

const CRatioContainer = styled.div`
  width: 30%;
  flex: 1 1 auto;
  margin: 0px 10px 0px 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;

  ${({ theme }) => theme.media.mobile`
    width: 38%;
    order: first;
    margin: 0;
  `}

  ${({ theme }) => theme.media.tablet`
    flex-wrap: wrap;
  `}
`;

const RatioLabel = styled(H4)`
  display: flex;
  font-weight: 800;
  justify-content: flex-start;
  margin-left: 16px;

  ${({ theme }) => theme.media.mobile`
    margin: 0px 10px;
    width: 50%;
    justify-content: center;
  `}

  ${({ theme }) => theme.media.tablet`
    justify-content: center;
    margin-left: 10px;
  `}
`;

const CRatioInfoLabel = styled.div`
  display: flex;
  width: 50%;
  flex-direction: row;
  justify-content: center;

  h4 {
    text-wrap: nowrap;
    width: fit-content;
  }
`;

const LiquidationBtn = styled.button<{ $isShow?: boolean }>`
  display: ${(props) => (props.$isShow ? "flex" : "none")};
  justify-content: flex-end;
  // align-items: flex-start;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: none;
  outline: none;
  // top: -10px;
  background: ${(props) => props.theme.colors.font["warning"]};
  cursor: pointer;
  font-size: 10px;
  color: ${(props) => props.theme.colors.font.primary};
`;

export default DebtBalance;
