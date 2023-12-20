import React from "react";
import styled from "styled-components";

type RoundButtonProps = {
  children: React.ReactNode;
  height: number;
  onClick?: () => void;
  padding?: string;
  color: string;
  width?: number;
  margin?: string;
  border?: string;
  disabled?: boolean;
};
export const RoundButton = (props:RoundButtonProps) => {
  return (
    <Container
      $height={props.height}
      onClick={props.onClick}
      $padding={props.padding}
      $color={props.color}
      $width={props.width}
      $margin={props.margin}
      $border={props.border}
      disabled={props.disabled}
    >
      {props.children}
    </Container>
  );
};

const Container = styled.button<{
  $height: number;
  $padding: string;
  $color: string;
  $width?: number;
  $margin: string;
  $border?: string;
}>`
  width: ${(props) => (props.$width ? `${props.$width}px` : "100%")};
  border-radius: 25px;
  border: ${(props) =>
    props.$border !== "none"
      ? `1px solid ${props.theme.colors.border[props.$border]}`
      : "none"};
  height: ${(props) => `${props.$height}px`};
  padding: ${(props) => (props.$padding ? props.$padding : "0px")};
  margin: ${(props) => (props.$margin ? props.$margin : "0px")};
  background-color: ${(props) =>
    props.theme.colors.background.button[props.$color]};
`;
