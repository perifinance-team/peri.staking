import React from "react";
import styled, { css } from "styled-components";
import { H3, H4 } from "components/heading";
import { RoundButton } from "components/button/RoundButton";
import { Input } from "../../components/Input/index";
import { MaxButton } from "components/button/MaxButton";
import { FeeAndPrice } from "components/fee";
import { formatCurrency } from "lib";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

export const MintCard = ({
    hide = false,
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
    const { balances, isReady } = useSelector((state: RootState) => state.balances);

    return (
        <Card $isActive={isActive} $border={"secondary"}>
            <IconContainer>
                {/* <CardTitle> */}
                    {true && <img src={`/images/icon/${currencyName}.svg`} alt="mint"></img>}
                    <H3 $weight={"sb"}>{currencyName}</H3>
                {/* </CardTitle> */}
                <H4 $weight={"m"}>[Staked: {formatCurrency(balances[currencyName]?.staked, 2)}]</H4>
            </IconContainer>
            <InputContainer $hide={hide}>
                <APYContainer>
                    <H4 $align={"right"} $weight={"sb"}>
                        APY: {formatCurrency(apy, 2)}%
                    </H4>
                    <H4 $align={"right"} $weight={"sb"}>
                        C-RATIO: {cRatio.toString()}%
                    </H4>
                </APYContainer>
                <RowContainer>
                    <Label>{"pUSD"}</Label>
                    <Input
                        disabled={!isActive || !isReady}
                        currencyName={"pUSD"}
                        value={isActive ? mintAmount : "0"}
                        onChange={(e) => onChange(e.target.value, currencyName)}
                        color={"primary"}
                        width="80%"
                    />
                    <MaxButton color={"secondary"} disabled={!isActive || !isReady} fontColor={"primary"} onClick={() => maxAction()} />
                </RowContainer>

                <RowContainer>
                    <Label>{currencyName}</Label>
                    <Input disabled={true} currencyName={currencyName} value={isActive ? stakeAmount : "0"} color={"primary"} width="90%"/>
                </RowContainer>
                <ColContainer>
                    {isApprove ? (
                        <RoundButton
                            height={30}
                            disabled={!isActive}
                            onClick={() => (isConnect ? approveAction() : false)}
                            color={"secondary"}
                            width={320}
                            margin={"0px 20px 0px 0px"}
                            shadow={isActive}
                        >
                            <H4 $weight={"sb"}>Approve</H4>
                        </RoundButton>
                    ) : (
                        <RoundButton
                            height={30}
                            disabled={!isActive || !isReady}
                            onClick={() => mintAction()}
                            color={"secondary"}
                            width={320}
                            margin={"0px 20px 0px 0px"}
                            shadow={isActive}
                        >
                            <H4 $weight={"sb"}>MINT</H4>
                        </RoundButton>
                    )}
                    {isActive && <FeeAndPrice currencyName={currencyName}></FeeAndPrice>}
                </ColContainer>
            </InputContainer>
        </Card>
    );
};

const IsActive = css<{ $border:string }>`
    // margin: 20px 0px;
    z-index: 2;
    box-shadow: ${(props) => `0px 0px 15px ${props.theme.colors.border[props.$border]}`};
    border: ${(props) => `2px solid ${props.theme.colors.border[props.$border]}`};
`;

export const Card = styled.div<{ $isActive: any, $border:string }>`
    display: flex;
    flex-direction: row;
    height: 100% !important;
    width: 90%;
    psotion: relative;
    top: 0;
    max-width: 600px;
    z-index: 1;
    border-radius: 20px;
    background: padding-box;
    background-color: ${(props) => props.theme.colors.background.body};
    border: ${(props) => `2px solid ${props.theme.colors.border.tableRow}`};
    ${(props) => (props.$isActive ? IsActive : null)}

    ${({ theme }) => theme.media.mobile`
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: fit-content;
        max-width: 450px;
    `}
`;

export const IconContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30%;

    img {
        width: 70px;
        height: 70px;
    }
    h3 {
        margin: 15px;
    }

    ${({ theme }) => theme.media.mobile`
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 25px 0 5px 0;
        height: fit-content;
        width: 100%;
        img {
            width: 30px;
            height: 30px;
        }
        h3 {
            width: fit-content;
            margin: 0px 5px;
        }
        h4 {
            width: fit-content;
        }
    `}
`;

export const CardTitle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;

    img {
        width: 70px;
        height: 70px;
    }
    h3 {
        margin: 15px;
    }

    ${({ theme }) => theme.media.mobile`
        justify-content: center;
        height: 30px;
        width: 100%;
        margin-bottom: 5px;
        img {
            width: 30px;
            height: 30px;
        }
        h3 {
            width: fit-content;
            margin: 0px 5px;
        }
    `}
`;

export const InputContainer = styled.div<{ $hide?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    width: 70%;
    height: 100%;

    ${({ theme, $hide }) => $hide ? theme.media.mobile`
        display: none;
        width: 100%;
    ` : theme.media.mobile`
        width: 100%;
    `}

`;

export const APYContainer = styled.div`
    width: 70%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    h4 {
        width: fit-content;
        font-size: 12px;
    }

    ${({ theme }) => theme.media.mobile`
        // justify-content: flex-end;
        h4 {
            font-size: 9px;
        }
        // width: 100%;

    `}
`;

export const RowContainer = styled.div<{ $margin?: string }>`
    width: 90%;
    display: flex;
    margin: ${(props) => (props.$margin ? `${props.$margin}px` : "10px")};
    flex-direction: row;
    align-items: center;

    button {
        width: 49px;
    }

    ${({ theme }) => theme.media.mobile`
        justify-content: center;
        width: 95%;
        margin: 10px 0 0 0px;

        h4 {
            width: 10%;
            margin: 0px 0px 0px 0px;
        }

    `}
`;


export const ColContainer = styled.div`
    width: 92%;
    display: flex;
    margin: 20px 0;
    flex-direction: column;
    align-items: center;

    button {
        margin: 0 20px 0 0;
        width: 85%;
    }

    ${({ theme }) => theme.media.mobile`
        justify-content: center;
        width: 100%;
        margin: 10px 0 15px 0;

        button {
            margin: 0;
            width: 75%;
        }
    `}

    ${({ theme }) => theme.media.tablet`
        justify-content: center;
        width: 95%;
        margin: 10px 0px 0px 0px;

        button {
            margin: 0 0 0 15px;
            width: 90%;
        }
    `}

`;

export const Label = styled(H4)`
    width: 50px;
`;
