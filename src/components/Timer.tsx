import { toggleLiquid, toggleNoti } from "config/reducers/liquidation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import Countdown from "react-countdown";

const Timer = () => {
  const dispatch = useDispatch();
  const { liquidation } = useSelector((state: RootState) => state.liquidation);

  // ! 블록체인에서 청산된 타임스탬프 가져와서 사용
  let today = new Date();
  let startTime = false ? today.getTime() : 1653379594992; // 22.05.24 5.07pm

  let setTime = 86400000; // 24

  const [escape, setEscape] = useState(false);

  const onEscapeHandler = () => {
    // ! 에러 바인딩 해줘야됨

    // 청산 가능 cratio를 올려야됨 누가 taken을 해주거나
    if (true) {
      setEscape(false);
      dispatch(toggleLiquid({ liquidation: false }));
      dispatch(toggleNoti({ toggle: true, title: 0 }));
    } else {
      setEscape(true);
      dispatch(toggleNoti({ toggle: true, title: 1 }));
    }
  };

  const renderer = ({ hours, minutes, completed }) => {
    if (completed) {
      setEscape(true);
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
      <Countdown date={startTime + setTime} renderer={renderer}>
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
