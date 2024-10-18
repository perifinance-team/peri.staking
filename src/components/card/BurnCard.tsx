import React from "react";
import styled from "styled-components";
import { H3, H4 } from "components/heading";
import { RoundButton } from "components/button/RoundButton";
import { Input } from "../../components/Input/index";
import { MaxButton } from "components/button/MaxButton";
import { FeeAndPrice } from "components/fee";
// import { useSelector } from "react-redux";
// import { RootState } from "config/reducers";
import { formatCurrency } from "lib";
import {
  Card,
  IconContainer,
  InputContainer,
  APYContainer,
  RowContainer,
  ColContainer,
  Label,
} from "../card/MintCard";
import { fromBigInt } from "lib/etc/utils";

export const BurnCard = ({
  hide = false,
  isActive,
  currencyName,
  burnAmount,
  unStakeAmount,
  burnAction,
  isLP = false,
  cRatio = 0n,
  maxAction,
  onChange,
  staked,
  decimals,
  isConnect,
  isReady,
  networkId,
}) => {
  // const { /* isConnect, */ networkId } = useSelector((state: RootState) => state.wallet);
  const swapName = {
    1: "UNI",
    3: "UNI",
    4: "UNI",
    5: "UNI",
    42: "UNI",
    56: "PANCAKE",
    97: "PANCAKE",
    137: "QUICK",
    80001: "QUICK",
  };
  return (
    <Card $isActive={isActive} $border={"tertiary"}>
      <IconContainer>
        <img
          src={`/images/icon/${
            isLP ? `${currencyName}_${swapName[networkId]}.png` : `${currencyName}.svg`
          }`}
          alt="burn"
        />
        <H3 $weight={"sb"}>{isLP ? `${swapName[networkId]}SWAP` : currencyName}</H3>
        <H4 $weight={"b"}>Staked: {formatCurrency(staked, 2)}</H4>
      </IconContainer>
      <InputContainer $hide={hide}>
        {!isLP && (
          <APYContainer>
            <Ratio $align={"right"} $weight={"sb"}>
              EST C-RATIO: {Number(fromBigInt(cRatio)).toFixed(2)}%
            </Ratio>
          </APYContainer>
        )}
        {!isLP && (
          <RowContainer>
            <Label>{"pUSD"}</Label>
            <Input
              disabled={!isActive || !isReady}
              currencyName={"pUSD"}
              value={isConnect ? burnAmount : ""}
              onChange={(e) => onChange(e.target.value, currencyName)}
              color={"primary"}
              placeholder={"0"}
            />
            <MaxButton
              disabled={!isActive || !isReady}
              color={"fourth"}
              fontColor={"fifth"}
              onClick={() => maxAction()}
            />
          </RowContainer>
        )}

        <RowContainer>
          <Label>{currencyName}</Label>
          <Input
            disabled={!isLP || !isActive}
            isLP={isLP}
            currencyName={isLP ? `${currencyName}_${swapName[networkId]}` : currencyName}
            value={isActive ? unStakeAmount : ""}
            onChange={(e) => onChange(e.target.value, currencyName)}
            color={"primary"}
            placeholder={"0." + "0".repeat(decimals)}
          />
          {isLP && (
            <MaxButton
              color={"fourth"}
              fontColor={"fifth"}
              onClick={() => maxAction()}
              disabled={!isActive || !isReady}
            />
          )}
        </RowContainer>
        <ColContainer>
          {!isLP ? (
            <RoundButton
              height={30}
              disabled={!isActive || !isReady}
              onClick={() => burnAction()}
              padding={"0"}
              color={"fourth"}
              width={320}
              margin={"0px 20px 0px 0px"}
              shadow={isActive}
            >
              <H4 $weight={"sb"} $color={"fifth"}>
                BURN
              </H4>
            </RoundButton>
          ) : (
            <RoundButton
              height={30}
              disabled={!isActive || !isReady}
              onClick={() => burnAction()}
              color={"fourth"}
              width={320}
              margin={"0px 20px 0px 0px"}
              shadow={isActive}
            >
              <H4 $weight={"sb"} $color={"fifth"}>
                UNSTAKE
              </H4>
            </RoundButton>
          )}
          {isActive && <FeeAndPrice currencyName={currencyName}></FeeAndPrice>}
        </ColContainer>
      </InputContainer>
    </Card>
  );
};
const Ratio = styled(H4)`
  width: 100% !important;
  text-align: center !important;
`;

// const IsActive = css`
//     min-width: 700px;
//     max-width: 850px;
//     width: 100%;
//     z-index: 2;
//     box-shadow: ${(props) => `0px 0px 15px ${props.theme.colors.border.tertiary}`};
//     border: ${(props) => `2px solid ${props.theme.colors.border.tertiary}`};
// `;

// const Card = styled.div<{ $isActive: any }>`
//     display: flex;
//     flex-direction: row;
//     height: 100%;
//     width: 100%;
//     max-width: 600px;
//     min-width: 400px;
//     z-index: 1;
//     border-radius: 20px;
//     background: padding-box;
//     background-color: ${(props) => props.theme.colors.background.body};
//     ${(props) => (props.$isActive ? IsActive : null)}

//     ${({ theme }) => theme.media.mobile`
//         flex-direction: column;
//         min-width: 350px;
//         max-width: 380px;
//         margin: 10px 0px;
//         height: 78%;
//     `}
// `;

// const IconContainer = styled.div`
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;

//     img {
//         width: 70px;
//         height: 70px;
//     }
//     h3 {
//         margin: 15px;
//     }

//     ${({ theme }) => theme.media.mobile`
//         flex: none;
//         flex-direction: row;
//         justify-content: center;
//         align-items: center;
//         margin: 20px 0px 0px 70px;
//         height: 30px;
//         img {
//             width: 30px;
//             height: 30px;
//         }
//         h3 {
//             margin: 0px 10px;
//         }
//     `}
// `;

// const InputContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     margin-top: 20px;
// `;

// const APYContainer = styled.div`
//     width: 460px;
//     display: flex;
//     flex-direction: row;
//     align-items: center;

//     ${({ theme }) => theme.media.mobile`
//         justify-content: flex-end;
//         width: 350px;

//     `}
// `;

// const RowContainer = styled.div<{ $margin?: string }>`
//     width: 460px;
//     display: flex;
//     margin: ${(props) => (props.$margin ? `${props.$margin}px` : "10px")};
//     flex-direction: row;
//     align-items: center;

//     ${({ theme }) => theme.media.mobile`
//         width: 330px;
//         margin: 10px 10px 0px 10px;
//         h4 {
//             width: 10%;
//             margin: 0px 0px 0px 0px;
//         }

//     `}
// `;

// const ColContainer = styled.div`
//     width: 460px;
//     display: flex;
//     margin: 10px;
//     flex-direction: column;
//     align-items: center;

//     button {
//         margin: 0 20px 0 0;
//         width: 320px;
//     }

//     ${({ theme }) => theme.media.mobile`
//         justify-content: center;
//         width: 330px;
//         margin: 10px 10px 0px 0px;

//         button {
//             margin: 0 0 0 15px;
//             width: 310px;
//         }
//     `}
// `;

// const Label = styled(H4)`
//     width: 50px;
// `;
