import React from "react";
import styled from "styled-components";
import { H3, H4 } from "components/heading";
import { RoundButton } from "components/button/RoundButton";
import { Input } from "../../components/Input/index";
import { Fee } from "components/fee";
import { formatCurrency } from "lib";
import {
  Card,
  IconContainer,
  InputContainer,
  APYContainer,
  RowContainer,
  ColContainer,
  Label,
} from "./MintCard";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

export const RewardCard = ({
  hide = false,
  isActive,
  actionName,
  rewardAction,
  periodAction,
  data,
}) => {
  const { isConnect } = useSelector((state: RootState) => state.wallet);

  return (
    <Card $isActive={isActive} $border={"primary"}>
      <IconContainer>
        <img src={`/images/icon/${actionName}.svg`} alt="reward" />
        <H3 $weight={"sb"}>{"PERI Staking"}</H3>
      </IconContainer>
      <InputContainer $hide={hide}>
        <RewardAPYContainer>
          <H4 $align={"right"} $weight={"sb"}>
            Due: {data.closeIn}
          </H4>
          <H4 $color={!data.rewards.staking || data.claimable ? "primary" : "warning"} $align={"right"} $weight={"sb"}>
            Status: {data.rewards.staking ? data.claimable ? "Claimable" : "Unclaimable" : "No Reward"}
          </H4>
        </RewardAPYContainer>
        <RowContainer>
          <Label>{"PERI"}</Label>
          <Input
            currencyName={"PERI"}
            value={formatCurrency(data.rewards.staking, 8)}
            color={"primary"}
            disabled={true}
          />
        </RowContainer>
        <RowContainer>
          <Label>{"pUSD"}</Label>
          <Input
            currencyName={"pUSD"}
            value={formatCurrency(data.rewards.exchange, 8)}
            color={"primary"}
            disabled={true}
          />
        </RowContainer>

        <ColContainer>
          {false && data?.isCloseFeePeriodEnabled && (
            <RoundButton
              height={30}
              onClick={() => periodAction()}
              color={"primary"}
              width={320}
              margin={"0px 20px 10px 0px"}
              shadow={isActive}
              disabled={!isConnect}
            >
              <H4 $weight={"b"} color={"primary"}>
                CLOSE CURRENT PERIOD
              </H4>
            </RoundButton>
          )}
          <RoundButton
            height={30}
            onClick={() => rewardAction()}
            padding={"0"}
            color={"primary"}
            width={320}
            margin={"0px 20px 0px 0px"}
            shadow={isActive}
            disabled={!isConnect}
          >
            <H4 $weight={"b"} color={"primary"}>
              CLAIM
            </H4>
          </RoundButton>
          {isActive && <Fee></Fee>}
        </ColContainer>
      </InputContainer>
    </Card>
  );
};

const RewardAPYContainer = styled(APYContainer)`
  width: 80%;

  ${({ theme }) => theme.media.mobile`
    width: 75%;
    margin-left: 35px;
  `}

  @media (max-width: 320px) {
    width: 85%;
    margin-left: 0px;
  }
`;

// const IsActive = css`
//     min-width: 700px;
//     max-width: 850px;
//     width: 100%;
//     z-index: 2;
//     box-shadow: ${(props) => `0px 0px 25px ${props.theme.colors.border.primary}`};
//     border: ${(props) => `2px solid ${props.theme.colors.border.primary}`};
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
//     background-color: ${(props) => props.theme.colors.background.panel};
//     ${(props) => (props.$isActive ? IsActive : null)}
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
// `;

// const InputContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     flex: 2;
//     justify-content: center;
// `;

// const RowContainer = styled.div<{ $margin?: string }>`
//     width: 460px;
//     display: flex;
//     margin: ${(props) => (props.$margin ? `${props.$margin}px` : "10px")};
//     flex-direction: row;
//     align-items: center;
// `;

// const ColContainer = styled.div`
//     width: 460px;
//     display: flex;
//     margin: 10px;
//     flex-direction: column;
//     align-items: center;
// `;

// const Label = styled(H4)`
//     width: 50px;
// `;
