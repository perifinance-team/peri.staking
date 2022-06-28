import React from "react";
import styled, { css } from "styled-components";
import { H3, H4 } from "components/heading";
import { RoundButton } from "components/button/RoundButton";
import { Input } from "../../components/Input/index";
import { Fee } from "components/Fee";
import { formatCurrency } from "lib";
// import { useSelector } from "react-redux"
// import { RootState } from 'config/reducers'

export const RewardCard = ({
  isActive,
  actionName,
  rewardAction,
  periodAction,
  data,
}) => {
  // const { isConnect } = useSelector((state: RootState) => state.wallet);

  return (
    <Card isActive={isActive}>
      <IconContainer>
        {isActive && (
          <img src={`/images/icon/${actionName}.svg`} alt="reward"></img>
        )}
        <H3 weight={"sb"}>{actionName}</H3>
      </IconContainer>
      <InputContainer>
        <RowContainer margin={"0px"}>
          {isActive && (
            <H4 align={"right"} weight={"sb"}>
              TIME LEFT: {data.closeIn}
            </H4>
          )}
          {isActive && (
            <ClaimAble align={"right"} weight={"sb"}>
              STATUS: {data.claimable ? "OPEN" : "CLOSE"}
            </ClaimAble>
          )}
        </RowContainer>
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
            value={formatCurrency(data.rewards.Exchange, 8)}
            color={"primary"}
            disabled={true}
          />
        </RowContainer>

        <ColContainer>
          {data?.isCloseFeePeriodEnabled && (
            <RoundButton
              height={30}
              onClick={() => periodAction()}
              padding={0}
              color={"primary"}
              border={"none"}
              width={320}
              margin={"0px 20px 10px 0px"}
            >
              <H4 weight={"b"} color={"primary"}>
                CLOSE CURRENT PERIOD
              </H4>
            </RoundButton>
          )}
          <RoundButton
            height={30}
            onClick={() => rewardAction()}
            padding={0}
            color={"tertiary"}
            border={"tertiary"}
            width={320}
            margin={"0px 20px 0px 0px"}
          >
            <H4 weight={"b"} color={"primary"}>
              CLAIM
            </H4>
          </RoundButton>
          {isActive && <Fee></Fee>}
        </ColContainer>
      </InputContainer>
    </Card>
  );
};
const ClaimAble = styled(H4)`
  margin-right: 80px;
`;

const IsActive = css`
  min-width: 700px;
  max-width: 850px;
  width: 100%;
  z-index: 2;
  box-shadow: ${(props) => `0px 0px 25px ${props.theme.colors.border.primary}`};
  border: ${(props) => `2px solid ${props.theme.colors.border.primary}`};
`;

const Card = styled.div<{ isActive: any }>`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  max-width: 600px;
  min-width: 400px;
  z-index: 1;
  border-radius: 20px;
  background: padding-box;
  background-color: ${(props) => props.theme.colors.background.panel};
  ${(props) => (props.isActive ? IsActive : null)}
`;

const IconContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 70px;
    height: 70px;
  }
  h3 {
    margin: 15px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  justify-content: center;
`;

const RowContainer = styled.div<{ margin?: string }>`
  width: 460px;
  display: flex;
  margin: ${(props) => (props.margin ? `${props.margin}px` : "10px")};
  flex-direction: row;
  align-items: center;
`;

const ColContainer = styled.div`
  width: 460px;
  display: flex;
  margin: 10px;
  flex-direction: column;
  align-items: center;
`;

const Label = styled(H4)`
  width: 50px;
`;
