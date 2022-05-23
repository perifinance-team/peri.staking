import React, { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";

// import Countdown from "react-countdown";

const Timer = (onTimerHandler: any) => {
  let today = new Date();
  let startTime = today.getTime();
  let setTime = 86400000; // 24

  const [escape, setEscape] = useState(false);

  const onEscapeHandler = () => {
    console.log("onEscapeHander");
  };

  return (
    <TimerContainer>
      {/* <Countdown date={startTime + setTime}></Countdown> */}
      <span>24:00</span>

      <EscapeBtn onClick={() => onEscapeHandler()} disabled={escape}>
        escape
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
  padding: 0.4rem;
`;

export default Timer;
