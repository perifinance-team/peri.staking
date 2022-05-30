import React from "react";
import { toggleLiquid, toggleNoti } from "config/reducers/liquidation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import Countdown from "react-countdown";

const Timer = () => {
  const dispatch = useDispatch();
  const { liquidation, thisState } = useSelector(
    (state: RootState) => state.liquidation
  );

  // ! 블록체인에서 청산된 타임스탬프 가져와서 사용
  let today = new Date();
  let startTime = false ? today.getTime() : 1653379594992; // 22.05.24 5.07pm

  let setTime = 86400000; // 24

  const onEscapeHandler = () => {
    // ! 에러 바인딩 해줘야됨

    if (liquidation) {
      if (thisState.status !== 1 || Number(thisState.cRatio) >= 150) {
        dispatch(toggleLiquid({ liquidation: false })); // ! contract를 업데이트해주는 걸로 변경
        dispatch(toggleNoti({ toggle: true, title: 0 }));
      } else {
        dispatch(toggleNoti({ toggle: true, title: 1 }));
      }
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

  return (
    <TimerContainer>
      <Countdown date={startTime + setTime} zeroPadTime={2} renderer={renderer}>
        <span>00:00</span>
      </Countdown>

      <EscapeBtn onClick={() => onEscapeHandler()} disabled={!liquidation}>
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
