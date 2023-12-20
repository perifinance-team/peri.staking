import React from "react";
import styled from "styled-components";
import { H4 } from "components/heading";

export const MaxButton = ({ color, onClick, fontColor, disabled = false }) => {
  return (
    <Container $color={color} onClick={onClick} disabled={disabled}>
      <H4 color={fontColor}>MAX</H4>
    </Container>
  );
};

const Container = styled.button<{ $color: string }>`
  border-radius: 25px;
  border: none;
  height: 30px;
  width: 50px;
  padding: 5px 10px;
  background-color: ${(props) =>
    props.theme.colors.background.button[props.$color]};
`;
