import React from "react";
import styled from "styled-components";

export const RoundButton = ({
  children,
  height,
  onClick,
  padding,
  color,
  width,
  margin = "0px",
  border,
  disabled = false,
}) => {
  return (
    <Container
      height={height}
      onClick={onClick}
      padding={padding}
      color={color}
      width={width}
      margin={margin}
      border={border}
      disabled={disabled}
    >
      {children}
    </Container>
  );
};

const Container = styled.button<{
  height: number;
  padding: string;
  color: string;
  width?: number;
  margin: string;
  border?: string;
}>`
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  border-radius: 25px;
  border: ${(props) =>
    props.border !== "none"
      ? `1px solid ${props.theme.colors.border[props.border]}`
      : "none"};
  height: ${(props) => `${props.height}px`};
  padding: ${(props) => (props.padding ? props.padding : "0")};
  margin: ${(props) => (props.margin ? props.margin : "0")};
  background-color: ${(props) =>
    props.theme.colors.background.button[props.color]};
`;
