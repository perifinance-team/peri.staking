import React from "react";
import styled, { css } from "styled-components";
import { H3, H4 } from "components/heading";
import { RoundButton } from "components/button/RoundButton";
import { Input } from "../../components/Input/index";
import { MaxButton } from "components/button/MaxButton";
import { Fee } from "components/fee";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { formatCurrency } from "lib";
import { Card, IconContainer, InputContainer, APYContainer, RowContainer, ColContainer, Label } from "./MintCard";

export const EarnCard = ({
    isActive,
    coinName,
    isStable = false,
    isApprove = false,
    approveAction = null,
    stakeAction,
    onChange,
    maxAction,
    stakeAmount = "",
    apy,
}) => {
    const { networkId, isConnect } = useSelector((state: RootState) => state.wallet);
    const { balances, isReady } = useSelector((state: RootState) => state.balances);
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
        <Card $isActive={isActive} $border={"secondary"}>
            <IconContainer>
                {isActive && <img src={`/images/icon/${coinName}_${swapName[networkId]}.png`} alt="earn"></img>}
                <H3 $weight={"sb"}>{swapName[networkId]}SWAP</H3>
                <H4 $weight={"b"}>Staked: {formatCurrency(balances[coinName]?.staked, 2)}</H4>
            </IconContainer>
            <InputContainer>
                <APYContainer>
                    <APY $align={"left"} $weight={"sb"}>
                        EST APY: {formatCurrency(apy, 2)}%
                    </APY>
                </APYContainer>
                <RowContainer>
                    <Label>{coinName}</Label>
                    <Input
                        disabled={!isActive}
                        isLP={true}
                        currencyName={`${coinName}_${swapName[networkId]}`}
                        value={stakeAmount}
                        onChange={(e) => {
                            onChange(e.target.value, coinName);
                        }}
                        color={"primary"}
                    />
                    <MaxButton disabled={!isActive || (isConnect && !isReady)} color={"secondary"} fontColor={"primary"} onClick={() => maxAction()} />
                </RowContainer>
                <ColContainer>
                    {isApprove ? (
                        <RoundButton
                            height={30}
                            onClick={() => approveAction()}
                            color={"secondary"}
                            width={320}
                            margin={"20px 20px 0px 0px"}
                            shadow={isActive}
                            disabled={!isActive || isConnect}
                        >
                            <H4 $weight={"sb"}>Approve</H4>
                        </RoundButton>
                    ) : (
                        <RoundButton
                            height={30}
                            disabled={!isActive || (isConnect && !isReady)}
                            onClick={() => stakeAction()}
                            color={"secondary"}
                            width={320}
                            margin={"20px 20px 0px 0px"}
                            shadow={isActive}
                        >
                            <H4 $weight={"sb"}>STAKE</H4>
                        </RoundButton>
                    )}
                    {isActive && <Fee></Fee>}
                </ColContainer>
            </InputContainer>
        </Card>
    );
};
const APY = styled(H4)`
    margin-left: 80px;

    ${({ theme }) => theme.media.mobile`
        margin-left: 60px;
    `}
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
