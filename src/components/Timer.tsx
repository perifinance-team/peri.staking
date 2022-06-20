import React, { useState } from "react";
import { toggleLiquid, toggleNoti } from "config/reducers/liquidation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { contracts } from "lib/contract";
import styled from "styled-components";
import Countdown from "react-countdown";
import { setLoading } from "config/reducers/loading";

const Timer = () => {
  const dispatch = useDispatch();
  const { liquidation, timestamp } = useSelector(
    (state: RootState) => state.liquidation
  );

  const { currentCRatio } = useSelector((state: RootState) => state.ratio);

  const ratioToPer = (value) => {
    if (value === 0n) return "0";
    return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
  };

  const [toggleBtn, setToggleBtn] = useState(liquidation);

  const setTime = 86400000; // 24

  const onEscapeHandler = async () => {
    dispatch(setLoading({ name: "liquidation", value: true }));

    try {
      if (Number(ratioToPer(currentCRatio)) <= 150) {
        dispatch(toggleNoti({ toggle: true, title: 1 }));
      } else if (150 < Number(ratioToPer(currentCRatio))) {
        const transaction = await contracts.signers.PeriFinance.exit();

        await contracts.provider.once(transaction.hash, (state: any) => {
          if (state.status === 1) {
            dispatch(toggleNoti({ toggle: true, title: 0 }));
            dispatch(toggleLiquid(true));
            setToggleBtn(false);

            dispatch(setLoading({ name: "liquidation", value: false }));
          }
        });
      }
    } catch (e) {
      console.log("escape handler error", e);
    }
  };

  const renderer = ({ hours, minutes, completed }) => {
    if (completed) {
      return <span>00:00</span>;
    } else {
      return (
        <span>
          {hours}:{minutes}
        </span>
      );
    }
  };

  const onComplete = () => {
    setToggleBtn(false);
  };

  // ? 타이머 테스트용 시간
  // Date.now() + 11100
  // parseInt(timestamp["_hex"], 16) + setTime

  return (
    <TimerContainer>
      <Countdown
        date={parseInt(timestamp["_hex"], 16) + setTime}
        renderer={renderer}
        onComplete={onComplete}
      >
        <span>00:00</span>
      </Countdown>

      <EscapeBtn onClick={() => onEscapeHandler()} disabled={!toggleBtn}>
        Escape
      </EscapeBtn>
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  span {
    color: ${(props) => props.theme.colors.font["warning"]};
    font-size: 4rem;
    font-weight: bold;
  }
`;

const EscapeBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: #2284e0;
  border: none;
  outline: none;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 1px;
  width: 10rem;
  padding: 0.4rem 0.2rem;
`;

export default Timer;
