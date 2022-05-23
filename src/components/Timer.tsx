import React, { useEffect, useLayoutEffect } from "react";
import { useState } from "react";
import styled from "styled-components";

const Timer = (onTimerHandler: any) => {
  const [time, setTime] = useState("24:00");

  // 블록체인에서 받아온 리퀴데이션 된 시간 - 현재 시간 = 남은 시간 (00:00 에서 종료)
  // setTime('받아온 시간')

  let today = new Date();
  let liquidTime = "17:00:10";
  let remainTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  console.log("remainTime", remainTime);
  let hours: number | string = 24;
  let minutes: number | string = 60;
  let seconds: number | string = 60;

  let allTime = hours * minutes * seconds;

  useLayoutEffect(() => {
    const tick = () => {
      hours = parseInt(String((allTime / 3600) % 24), 10);
      minutes = parseInt(String((allTime / 60) % 60), 10);
      seconds = parseInt(String(allTime % 60), 10);
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      setTime(`${hours}:${minutes}`);
      //   onTimerHandler(time);

      --allTime;
    };

    const timeSet = setInterval(tick, 1000);

    return () => clearInterval(timeSet);
  }, []);

  return <TimerContainer>{time}</TimerContainer>;
};

const TimerContainer = styled.div`
  color: ${(props) => props.theme.colors.font["warning"]};
  font-size: 4rem;
  font-weight: bold;
`;

export default Timer;
