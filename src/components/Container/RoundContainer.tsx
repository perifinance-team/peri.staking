import React from "react";
import styled from "styled-components";

type RoundContainerProps = {
  children: React.ReactNode;
  height: number;
  padding: string;
  onClick?: () => void;
};

export const RoundContainer = (props: RoundContainerProps) => {
  return (
    <Container $height={props.height} $padding={props.padding} onClick={props.onClick}>
      {props.children}
    </Container>
  );
};

const Container = styled.div<{ $height: number; $padding: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  height: 30px;
  padding: ${(props) => (props.$padding ? props.$padding : "0")};
  background-color: ${(props) => props.theme.colors.background.panel};
`;
