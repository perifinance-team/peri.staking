import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { contracts } from "lib/contract";
import { H4 } from "components/heading";
import { StyledTHeader, StyledTBody, Row, Cell, BorderRow } from "components/table";
import { NotificationManager } from "react-notifications";

import { getEscrowList } from "lib/escrow";
import { setLoading } from "config/reducers/loading";
import { RootState } from "config/reducers";
import { updateTransaction } from "config/reducers/transaction";

interface IEntry {
    amount: string;
    endTime: string;
    id: object;
    toggle: boolean;
}

const Escrow = () => {
    const dispatch = useDispatch();

    const { address, networkId } = useSelector((state: RootState) => state.wallet);

    const { RewardEscrowV2 } = contracts as any;
    const [escrowList, setEscrowList] = useState([]);

    const getEscrowListData = async (isLoading: boolean) => {
        dispatch(setLoading({ name: "escrow", value: isLoading }));

        try {
            await getEscrowList(RewardEscrowV2, address).then((data: object[]) => {
                setEscrowList(data);
            });
        } catch (e) {
            console.log("getEscrow error", e);
        }

        dispatch(setLoading({ name: "escrow", value: false }));
    };

    useEffect(() => {
        (async () => {
            return await getEscrowListData(true);
        })();

        // eslint-disable-next-line
    }, [address, networkId]);

    const getEscrowHandler = async (contracts) => {
        dispatch(setLoading({ name: "escrow", value: true }));

        const idList = [];

        escrowList.forEach((entry: IEntry) => {
            entry.toggle && idList.push(entry.id);
        });

        if (0 < idList.length) {
            try {
                const transaction = await contracts.signers.RewardEscrowV2.vest(idList);

                await contracts.provider.once(transaction.hash, async (state) => {
                    if (state.status === 1) {
                        // NotificationManager.success(`success`, "SUCCESS");
                        dispatch(
                            updateTransaction({
                                hash: transaction.hash,
                                message: `Vesting`,
                                type: "To My Wallet",
                            })
                        );
                        dispatch(setLoading({ name: "escrow", value: false }));
                    }
                });
            } catch (e) {
                console.log("vesting error", e);
                NotificationManager.success(``, "FAIL");
                dispatch(setLoading({ name: "escrow", value: false }));
            }
        } else {
            NotificationManager.warning(``, "FAIL");
            dispatch(setLoading({ name: "escrow", value: false }));
        }

        await getEscrowListData(true);
    };

    const sumAmount = () => {
        let result = 0;

        escrowList.forEach((item) => {
            if (item.toggle) {
                result += Number(item.amount.replace(",", ""));
            }
        });

        return result.toFixed(2);
    };

    return (
        <Container>
            <span className="currentAmount">Currently available amount: {sumAmount()}</span>
            <TableContainer style={{ overflowY: "hidden", maxHeight: "70vh" }}>
                <StyledTHeader>
                    <Row>
                        <AmountCell>
                            <H4 $weight={"b"}>Index</H4>
                        </AmountCell>
                        <AmountCell>
                            <H4 $weight={"b"}>Escrow amount</H4>
                        </AmountCell>
                        <AmountCell>
                            <H4 $weight={"b"}>Time</H4>
                        </AmountCell>
                    </Row>
                </StyledTHeader>
                <StyledTBody>
                    {escrowList.map((item, idx: number) => {
                        return (
                            <BorderRow
                                key={`row${idx}`}
                                style={{
                                    minHeight: "9rem",
                                    height: "10rem",
                                    background: !item.toggle && "rgba(80, 80, 80, 0.1)",
                                }}
                            >
                                <AmountCell>
                                    <H4 style={{ color: !item.toggle && "#505050" }} $weight={"m"}>
                                        {idx + 1}
                                    </H4>
                                </AmountCell>
                                <AmountCell>
                                    <Image>
                                        <span style={{ color: !item.toggle && "#505050" }}>{`${item.amount}`}</span>
                                    </Image>
                                </AmountCell>
                                <AmountCell>
                                    <H4 $weight={"m"} style={{ color: !item.toggle && "#505050" }}>
                                        {item.endTime === "0" ? "-" : item.endTime}
                                    </H4>
                                </AmountCell>
                            </BorderRow>
                        );
                    })}
                </StyledTBody>
            </TableContainer>
            <EscrowBtn onClick={() => getEscrowHandler(contracts)}>To My Wallet</EscrowBtn>
        </Container>
    );
};

const AmountCell = styled(Cell)`
    max-width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 25px;
`;

const Container = styled.div`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
    flex-direction: column;
    justify-content: center;

    .currentAmount {
        color: white;
        margin: 0 auto 9px 92px;
        font-size: 1.1rem;
        font-weight: bold;
    }
`;

const TableContainer = styled.div`
    z-index: 1;
    border-radius: 25px;
    height: 40%;
    margin: 0 70px;
    padding: 50px 40px;
    background-color: ${(props) => props.theme.colors.background.panel};
    box-shadow: ${(props) => `0px 0px 25px ${props.theme.colors.border.primary}`};
    border: ${(props) => `2px solid ${props.theme.colors.border.primary}`};
`;

const Image = styled.li`
    display: flex;
    align-items: center;
    margin-right: 1.8rem;

    img {
        width: 20px;
        height: 20px;
        margin-right: 0.3rem;
    }

    span {
        color: white;
        font-size: 1.3rem;
    }
`;

const EscrowBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 242px;
    height: 48px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
    bottom: 40px;
    background: #ffffff;
    color: #4182f0;
    border: 2px solid #4182f0;
    border-radius: 10px;
    font-weight: 800;
    font-size: 18px;
    font-family: "Montserrat";

    &:hover {
        background: #4182f0;
        color: #ffffff;
    }
`;

export default Escrow;
