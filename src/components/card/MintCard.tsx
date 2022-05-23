import React from "react";
import styled, { css } from "styled-components";
import { H3, H4, H5 } from "components/headding";
import { RoundButton } from "components/button/RoundButton";
import { Input } from "components/Input";
import { MaxButton } from "components/button/MaxButton";
import { FeeAndPrice } from "components/Fee";
import { formatCurrency } from "lib";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

export const MintCard = ({
  isActive,
  currencyName,
  cRatio = 0n,
  isApprove = false,
  approveAction = null,
  mintAction,
  mintAmount,
  stakeAmount,
  onChange,
  maxAction,
  apy,
}) => {
  const { isConnect } = useSelector((state: RootState) => state.wallet);
  const { balances } = useSelector((state: RootState) => state.balances);

  return (
    <Card isActive={isActive}>
      <IconContainer>
        {isActive && (
          <img src={`/images/icon/${currencyName}.svg`} alt="mint"></img>
        )}
        <H3 weigth={"sb"}>{currencyName}</H3>
        <H4 weigth={"b"}>
          Staked: {formatCurrency(balances[currencyName]?.staked, 2)}
        </H4>
      </IconContainer>
      <InputContainer>
        <RowContainer margin={"0px"}>
          {isActive && (
            <H4 align={"right"} weigth={"sb"}>
              EST APY: {formatCurrency(apy, 2)}%
            </H4>
          )}
          {isActive && (
            <Ratio align={"right"} weigth={"sb"}>
              EST C-RATIO: {cRatio.toString()}%
            </Ratio>
          )}
        </RowContainer>
        <RowContainer>
          <Lable>{"pUSD"}</Lable>
          <Input
            disabled={!isActive}
            currencyName={"pUSD"}
            value={isActive ? mintAmount : "0"}
            onChange={(e) => onChange(e.target.value, currencyName)}
            color={"primary"}
          />
          <MaxButton
            color={"secondary"}
            disabled={!isActive}
            fontColor={"primary"}
            onClick={() => maxAction()}
          />
        </RowContainer>

        <RowContainer>
          <Lable>{currencyName}</Lable>
          <Input
            disabled={true}
            currencyName={currencyName}
            value={isActive ? stakeAmount : "0"}
            color={"primary"}
          />
        </RowContainer>
        <ColContainer>
          {isApprove ? (
            <RoundButton
              height={30}
              disabled={!isActive}
              onClick={() => (isConnect ? approveAction() : false)}
              padding={0}
              color={"secondary"}
              width={320}
              border={"none"}
              margin={"0px 20px 0px 0px"}
            >
              <H4 weigth={"sb"}>Approve</H4>
            </RoundButton>
          ) : (
            <RoundButton
              height={30}
              disabled={!isActive}
              onClick={() => mintAction()}
              padding={0}
              color={"secondary"}
              width={320}
              border={"none"}
              margin={"0px 20px 0px 0px"}
            >
              <H4 weigth={"sb"}>MINT</H4>
            </RoundButton>
          )}

          {isActive && <FeeAndPrice currencyName={currencyName}></FeeAndPrice>}
        </ColContainer>
      </InputContainer>
    </Card>
  );
};

const Ratio = styled(H4)`
  margin-right: 80px;
`;

const IsActive = css`
  margin: 20px 0px;
  min-width: 700px;
  max-width: 850px;
  width: 100%;
  z-index: 2;
  box-shadow: ${(props) =>
    `0px 0px 25px ${props.theme.colors.border.secondary}`};
  border: ${(props) => `2px solid ${props.theme.colors.border.secondary}`};
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

const Lable = styled(H4)`
  width: 50px;
`;
