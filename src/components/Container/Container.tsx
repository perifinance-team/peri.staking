import React from "react";
import styled from "styled-components";

type ContainerProps = {
  children: React.ReactNode;
  height: string|number;
  padding: string;
  rounded?: number;
  shadow?: boolean;
  position?: string;
  minWidth?: number;
  margin?: string;
  onClick?: () => void;
};

export const Container = (props: ContainerProps) => {
  return (
    <BaseContainer
      $height={props.height}
      $padding={props.padding}
      $rounded={props.rounded}
      $shadow={props.shadow}
      $position={props.position}
      $minWidth={props.minWidth}
      $margin={props.margin}
      onClick={props.onClick}
    >
      {props.children}
    </BaseContainer>
  );
};

export const BaseContainer = styled.div<{
  $height: string|number;
  $padding?: string;
  $rounded?: number;
  $shadow?: boolean;
  $position?: string;
  $minWidth?: number;
  $margin?: string;
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: ${(props) => (props.$margin ? props.$margin : "0px")};
  height: ${(props) => `${typeof props.$height === "number" ? props.$height + "px" : props.$height}`};
  min-width: ${(props) => `${props.$minWidth ? props.$minWidth + "px" : "auto"}`};
  position: ${(props) => (props.$position ? props.$position : "relative")};
  border-radius: ${(props) => (props.$rounded ? props.$rounded : "25")}px;
  box-shadow: ${(props) =>
    props.$shadow ? `0px 0px 25px ${props.theme.colors.border.primary}` : "none"};
  padding: ${(props) => (props.$padding ? props.$padding : "0px")};
  background-color: ${(props) => props.theme.colors.background.panel};
`;
