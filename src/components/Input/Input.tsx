import React from "react";
import styled from "styled-components";

export const Input = ({
  height = 30,
  disabled = false,
  currencyName,
  onChange = undefined,
  value = "0",
  color,
  isLP = false,
  width = '100%',
}) => {
  return (
    <>
      <Container $color={color} $disabled={disabled} $height={height} $width={width}>
        <AssetContainer $height={height} $isLP={isLP}>
          <img
            src={`/images/currencies/${currencyName}.png`}
            alt="currency"
          ></img>
        </AssetContainer>
        <InputContainer>
          <AmountInput
            type="text"
            $height={height}
            disabled={disabled}
            onChange={onChange}
            value={value}
          ></AmountInput>
        </InputContainer>
      </Container>
    </>
  );
};

const Container = styled.div<{
  $color: string;
  $disabled: boolean;
  $height: number;
  $width: string;
}>`
  display: flex;
  flex-direction: row;
  height: ${(props) => `${props.$height}px`};
  width: ${(props) => props.$width};
  flex-direction: row;
  justify-content: space-between;
  border-radius: 25px;
  margin: 0px 10px;
  border: 1px solid ${(props) => props.theme.colors.border.tableRow};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  background-color: ${(props) =>
    props.theme.colors.background.input[props.$color]};
`;

const AssetContainer = styled.div<{ $height: number; $isLP?: boolean }>`
  height: ${(props) => `${props.$height}px`};
  padding: 5px 10px;
  img {
    width: ${(props) => (props.$isLP ? "32px" : `20px`)};
    height: "22px";
  }
`;

const InputContainer = styled.div`
  display: flex;
  vertical-align: middle;
  flex: 3;
  margin: 0px 10px;
  background: transparent;
`;

const AmountInput = styled.input<{ $height: number }>`
  margin: auto;
  height: ${(props) => `${props.$height}px`};
  width: 100%;
  font-weight: 500;
  font-size: 16px;
  border: none;
  background: transparent;
  text-align: right;
  color: ${(props) => props.theme.colors.font.primary};

  :focus {
    outline: none;
  }

  :disabled {
    opacity: 0.5;
  }

  ${({ theme }) => theme.media.mobile`
    font-size: 12px;
  `}
`;
