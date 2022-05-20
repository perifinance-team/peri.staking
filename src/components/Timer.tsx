import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import styled from "styled-components";

const Timer = (onTimerHandler: any) => {
  const [time, setTime] = useState("24:00");
  const callbackTime = useRef<any>();

  let hours: number | string = 24;
  let minutes: number | string = 60;
  let seconds: number | string = 60;
  let allTime = hours * minutes * seconds;

  const callback = (time: string) => {
    setTime(time);
  };

  useEffect(() => {
    callbackTime.current = callback;
  });

  useEffect(() => {
    const tick = () => {
      hours = parseInt(String((allTime / 3600) % 24), 10);
      minutes = parseInt(String((allTime / 60) % 60), 10);
      seconds = parseInt(String(allTime % 60), 10);
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      callbackTime.current(`${hours}:${minutes}`);

      --allTime;
    };

    const timeSet = setInterval(tick, 1000);

    return () => clearInterval(timeSet);
  }, []);
  console.log("time", time);
  return <TimerContainer>{time}</TimerContainer>;
};

const TimerContainer = styled.div`
  color: ${(props) => props.theme.colors.font["warning"]};
  font-size: 4rem;
  font-weight: bold;
`;

export default Timer;
