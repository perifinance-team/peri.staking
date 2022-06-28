import React from "react";
import styled from "styled-components";

export const RoundContainer = ({ children, height, padding }) => {
  return (
    <Container height={height} padding={padding}>
      {children}
    </Container>
  );
};

const Container = styled.div<{ height: number; padding: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  height: 30px;
  padding: ${(props) => (props.padding ? props.padding : "0")};
  background-color: ${(props) => props.theme.colors.background.panel};
`;
