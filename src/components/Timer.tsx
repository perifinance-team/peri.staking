import { toggleNoti } from "config/reducers/liquidation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import Countdown from "react-countdown";

const Timer = () => {
  const dispatch = useDispatch();
  const { liquidation, timestamp } = useSelector(
    (state: RootState) => state.liquidation
  );

  let setTime = 86400000; // 24

  const [escape, setEscape] = useState(false);

  const onEscapeHandler = () => {
    // ! 에러 바인딩 해줘야됨
    if (!liquidation) {
      setEscape(true);
    } else {
      setEscape(false);
    }

    dispatch(toggleNoti({ notification: true }));
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
      <Countdown date={timestamp + setTime} renderer={renderer}>
        <span>00:00</span>
      </Countdown>

      <EscapeBtn onClick={() => onEscapeHandler()} disabled={escape}>
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
