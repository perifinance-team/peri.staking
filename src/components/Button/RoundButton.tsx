import React from "react";
import styled from "styled-components";

type RoundButtonProps = {
  children: React.ReactNode;
  height: number | string;
  onClick?: () => void;
  padding?: string;
  color?: string;
  width?: number | string;
  margin?: string;
  shadow?: boolean;
  minWidth?: number | string;
  disabled?: boolean;
};
export const RoundButton = (props:RoundButtonProps) => {
  return (
    <BaseButton
      $height={props.height}
      onClick={props.onClick}
      $padding={props.padding}
      $color={props.color}
      $width={props.width}
      $margin={props.margin}
      $shadow={props.shadow}
      $minWidth={props.minWidth}
      disabled={props.disabled}
    >
      {props.children}
    </BaseButton>
  );
};

export const BaseButton = styled.button<{
  $height: number | string;
  $padding?: string;
  $color?: string;
  $width?: number | string;
  $margin?: string;
  $shadow?: boolean;
  $minWidth?: number | string;
}>`
  display: flex;
  align-items: center;
  border-radius: 25px;
  width: ${(props) => (props.$width 
    ? typeof props.$width === 'string'
    ? props.$width
    :`${props.$width}px` 
    : "auto"
  )};
  min-width: ${(props) => (props.$minWidth 
    ? typeof props.$minWidth === 'string'
    ? props.$minWidth 
    :`${props.$minWidth}px`
    : "fit-content"
  )};
  height: ${(props) => typeof props.$height === "string"
    ? props.$height 
    : `${props.$height}px`};
  padding: ${(props) => (props.$padding ? props.$padding : "0px")};
  margin: ${(props) => (props.$margin ? props.$margin : "0px")};
  background-color: ${(props) =>
    props.$color 
    ? props.theme.colors.background.button[props.$color]
    : props.theme.colors.background.button.fifth
  };

  border: ${({theme}) => `1px solid ${theme.colors.border.tableRow}`};
  box-shadow: 0.5px 1.5px 0px ${(props) => 
    props.$shadow ? 
    props.theme.colors.background.button[props.$color]
    : "none"
  };
  background-color: ${(props) => props.theme.colors.background.button.fifth};

  h4 {
    color: ${(props) =>
      props.theme.colors.background.button[props.$color]};
  }

  &:hover {
		transition: 0.2s ease-in-out;
		transform: translateY(-1px);
		box-shadow: ${(props) => `0.5px 3px 0px ${props.theme.colors.background.button[props.$color]}`};
	}

	&:active {
		transform: translateY(1px);
		box-shadow: none;
	}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }


  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  ${({ theme }) => theme.media.mobile`
    h4 {
      font-weight: 600;
    }
  `}
`;
