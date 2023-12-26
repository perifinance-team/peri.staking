import React from "react";
import styled from "styled-components";
import { H4 } from "components/heading";

export const MaxButton = ({ color, onClick, fontColor, disabled = false }) => {
  return (
    <Container $color={color} onClick={onClick} disabled={disabled}>
      <H4 $color={fontColor}>MAX</H4>
    </Container>
  );
};

const Container = styled.button<{ $color: string }>`
  border-radius: 25px;
  border: none;
  height: 30px;
  width: 50px;
  padding: 5px 10px;
  border: ${(props) => `1px solid ${props.theme.colors.border.tableRow}`};
  box-shadow: 0.5px 1.5px 0px ${(props) => props.theme.colors.background.button[props.$color]};
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
    width: 45px;

    h4 {
      font-weight: 600;
      font-size: 10px;
    }
  `}
`;
