import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import { H1, H4 } from "components/heading";
import { StyledTHeader, StyledTBody, Row, Cell, BorderRow } from "components/table";
import { formatCurrency } from "lib";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Escrow from "pages/Escrow";
import Liquidation from "pages/Liquidation";
import Vesting from "pages/Vesting";

const Balance = () => {
    const { balances } = useSelector((state: RootState) => state.balances);
    const { networkId } = useSelector((state: RootState) => state.wallet);
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
        <Router basename="/balance">
			<Switch>
				<Route exact path="/">
                    <Container>
                        <Title>
                            <H1>TOTAL BALANCE</H1>
                        </Title>
                        <TableContainer>
                            <StyledTHeader>
                                <Row>
                                    <Cell>
                                        <H4 $weight={"b"} $align={"center"}>
                                            Asset
                                        </H4>
                                    </Cell>
                                    <AmountCell>
                                        <H4 $weight={"b"}>Staked</H4>
                                    </AmountCell>
                                    <AmountCell>
                                        <H4 $weight={"b"}>Stakeable</H4>
                                    </AmountCell>
                                    <AmountCell>
                                        <H4 $weight={"b"}>Transferable</H4>
                                    </AmountCell>
                                    <AmountCell>
                                        <H4 $weight={"b"}>Escrow</H4>
                                    </AmountCell>
                                    <AmountCell>
                                        <H4 $weight={"b"}>Total</H4>
                                    </AmountCell>
                                </Row>
                            </StyledTHeader>
                            <StyledTBody>
                                {Object.keys(balances).map((currencyName) => {
                                    if ((networkId === 1287 || networkId === 1285) && currencyName === "LP") return <></>;
                                    else
                                        return (
                                            <BorderRow key={currencyName}>
                                                <AssetCell>
                                                    <Asset $isLP={currencyName === "LP"}>
                                                        <img
                                                            src={`/images/currencies/${
                                                                currencyName === "LP"
                                                                    ? `${currencyName}_${swapName[networkId]}.png`
                                                                    : `${currencyName}.png`
                                                            }`}
                                                            alt="lp"
                                                        ></img>
                                                        <H4 $weight={"m"} $align={"left"}>
                                                            {currencyName}
                                                        </H4>
                                                    </Asset>
                                                </AssetCell>
                                                <AmountCell>
                                                    <H4 $weight={"m"} $align={"right"}>
                                                        {formatCurrency(balances[currencyName].staked)}
                                                    </H4>
                                                </AmountCell>
                                                <AmountCell>
                                                    <H4 $weight={"m"} $align={"right"}>
                                                        {formatCurrency(balances[currencyName].stakeable)}
                                                    </H4>
                                                </AmountCell>
                                                <AmountCell>
                                                    <H4 $weight={"m"} $align={"right"}>
                                                        {formatCurrency(balances[currencyName].transferable)}
                                                    </H4>
                                                </AmountCell>
                                                <AmountCell>
                                                    <H4 $weight={"m"} $align={"right"}>
                                                        {formatCurrency(balances[currencyName].rewardEscrow)}
                                                    </H4>
                                                </AmountCell>
                                                <AmountCell>
                                                    <H4 $weight={"m"} $align={"right"}>
                                                        {formatCurrency(balances[currencyName].balance)}
                                                    </H4>
                                                </AmountCell>
                                            </BorderRow>
                                        );
                                })}
                            </StyledTBody>
                        </TableContainer>
                    </Container>
                </Route>
                <Route exact path="/escrow">
					<Escrow/>
				</Route>
				<Route exact path="/liquidation">
					<Liquidation/>
				</Route>
				<Route exact path="/vesting">
					<Vesting/>
				</Route>
            </Switch>
        </Router>
    );
};
const AssetCell = styled(Cell)`
    width: 120px;
    margin-left: 10px;
`;

const AmountCell = styled(Cell)`
    max-width: 100%;
    padding: 5px 15px;
`;

const Asset = styled.div<{ $isLP?: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    h4 {
        margin-left: 10px;
    }
    img {
        width: ${(props) => (props.$isLP ? "32px" : "20px")};
        height: 20px;
    }
`;

const Container = styled.div`
    display: flex;
    height: 80vh;
    width: 100%;
    // position: relative;
    flex-direction: column;
    justify-content: flex-start;

    ${({ theme }) => theme.media.mobile`
		height: 45vh;
	`}
`;

const Title = styled.div`
    z-index: 0;
    justify-content: flex-start;

    h1 {
        width: fit-content;
        // margin-left: 70px;
    }
`;

const TableContainer = styled.div`
    z-index: 1;
    border-radius: 10px;
    height: 60%;
    margin: 0 70px;
    top: -40px;
    // padding: 50px 40px;
    background-color: ${(props) => props.theme.colors.background.body};
    box-shadow: ${(props) => `0px 0px 25px ${props.theme.colors.border.primary}`};
    border: ${(props) => `2px solid ${props.theme.colors.border.primary}`};

    ${({ theme }) => theme.media.mobile`
        margin: 0;
        width: 99%;
        height: 85%;
        overflow-y: hidden;
        overflow-x: auto;
        padding: 0;
        border-radius: 5px;
    `}
`;

export default Balance;
