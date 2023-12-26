import React from "react";
import styled from "styled-components";

import Logo from "./components/Logo";
import Navigator from "./components/Navigator";

const LeftAside = () => {
  return (
    <Aside>

      <Logo mobile={'desktop'}></Logo>
      <Navigator></Navigator>
    </Aside>
  );
};
const Aside = styled.aside`
  // flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 240px;
  min-width: 150px;
  width: 18vw;
  flex-shink: 1;
  background-color: ${(props) => props.theme.colors.background.body};
  align-items: center;
  padding: 30px 10px 0px 0;

  ${({ theme }) => theme.media.mobile`
    display: none;
    padding: 30px 20px;
  `}

  ${({ theme }) => theme.media.tablet`
    display: none;
    padding: 30px 20px;
  `}
`;

export default LeftAside;
