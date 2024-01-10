import React from "react";
import styled, { css } from "styled-components";
import { H3, H4 } from "components/heading";
import { RoundButton } from "components/button/RoundButton";
import { Input } from "../../components/Input/index";
import { Fee } from "components/fee";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { formatCurrency } from "lib";
import { Card, IconContainer, InputContainer, APYContainer, RowContainer, ColContainer, Label} from "./MintCard";


export const LPRewardCard = ({ isActive, actionName, rewardAction, data }) => {
    const { networkId } = useSelector((state: RootState) => state.wallet);
    const { isReady } = useSelector((state: RootState) => state.balances);

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
        <Card $isActive={isActive} $border={"primary"}>
            <IconContainer>
                <img src={`/images/icon/${actionName}_${swapName[networkId]}.png`} alt="LP"/>
                <H3 $weight={"sb"}>{swapName[networkId]}SWAP</H3>
            </IconContainer>
            <InputContainer>
                <APYContainer>
                    <H4 $align={"right"} $weight={"sb"}>
                        {/* TIME LEFT: {data.closeIn} */}
                    </H4>
                    <H4 $align={"right"} $weight={"sb"}>
                        Status: {data.rewardEscrow ? "Claimable" : "No Reward"}
                    </H4>
                </APYContainer>
                <RowContainer>
                    <Label>{"PERI"}</Label>
                    <Input
                        currencyName={"PERI"}
                        value={isActive ? formatCurrency(data.rewardEscrow, 8) : ""}
                        color={"primary"}
                        disabled={true}
                    />
                </RowContainer>
                <ColContainer>
                    {/* <RoundButton height={30} onClick={() => periodAction()} padding={0} color={'primary'} border={'none'} width={320} margin={'0px 20px 10px 0px'}>
                        <H4 $weight={'b'} color={'primary'}>CLOSE CURRENT PERIOD</H4>
                    </RoundButton> */}
                    <RoundButton
                        disabled={!isActive || !isReady}
                        height={30}
                        onClick={() => rewardAction()}
                        color={"primary"}
                        width={320}
                        margin={"0px 20px 0px 0px"}
                        shadow={true}
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

// const ClaimAble = styled(H4)`
//     margin-right: 80px;
// `;

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
