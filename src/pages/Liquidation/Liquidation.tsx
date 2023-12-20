import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { RootState } from "config/reducers";
import { setLoading } from "config/reducers/loading";

import { contracts } from "lib/contract";
import { formatCurrency } from "lib";
import { getLiquidationList } from "lib/liquidation";

import { StyledTHeader, StyledTBody, Row, Cell, BorderRow } from "components/table";
import { H4 } from "components/heading";
import TakeModal from "components/TakeModal";
import { updateList } from "config/reducers/liquidation";

const Liquidation = () => {
    const dispatch = useDispatch();

    const { balances } = useSelector((state: RootState) => state.balances);
    const { address, networkId } = useSelector((state: RootState) => state.wallet);
    const { list } = useSelector((state: RootState) => state.liquidation);
    const transaction = useSelector((state: RootState) => state.transaction);

    const statusList = ["Open", "Taken", "Closed"];

    const ratioToPer = (originValue) => {
        const value = BigInt(originValue);
        if (value === 0n) return "0";
        return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
    };

    const getLiquidationData = useCallback(
        async (isLoading) => {
            dispatch(setLoading({ name: "liquidation", value: isLoading }));
            try {
                if (address) {
                    await getLiquidationList(dispatch, networkId);
                }
            } catch (e) {
                console.log("getLiquidation error", e);
            }

            dispatch(setLoading({ name: "liquidation", value: false }));
        },
        [address, dispatch, networkId]
    );

    const toggleModal = (flag: number) => {
        const updateListItems = list.map((item, idx) => {
            return flag === idx ? { ...item, toggle: !item.toggle } : item;
        });
        dispatch(updateList(updateListItems));
    };

    const [sortList, setSortList] = useState({ cRatio: true, debt: false, peri: false, dai: false, usdc: false });
    const [neutral, setNeutral] = useState(1);
    const [selected, setSelected] = useState("Peri");
    const [drop, setDrop] = useState(false);

    const sortListHandler = (direction: boolean, flag: string) => {
        // "asc", "desc";
        if (flag === "Peri" || flag === "USDC" || flag === "DAI") {
            let flagIdx = 0;
            switch (flag) {
                case "Peri":
                    flagIdx = 0;
                    break;
                case "DAI":
                    flagIdx = 1;
                    break;
                case "USDC":
                    flagIdx = 2;
                    break;
                default:
                    break;
            }

            const updateListItems = direction
                ? list
                      .map((item) => item)
                      .sort(
                          (a, b) =>
                              Number(formatCurrency(b.collateral[flagIdx].value).replaceAll(",", "")) -
                              Number(formatCurrency(a.collateral[flagIdx].value).replaceAll(",", ""))
                      )
                : list
                      .map((item) => item)
                      .sort(
                          (a, b) =>
                              Number(formatCurrency(a.collateral[flagIdx].value).replaceAll(",", "")) -
                              Number(formatCurrency(b.collateral[flagIdx].value).replaceAll(",", ""))
                      );

            dispatch(updateList(updateListItems));
        } else {
            const updateListItems = direction
                ? list
                      .map((item) => item)
                      .sort(
                          (a, b) =>
                              Number(formatCurrency(b[flag]).replaceAll(",", "")) -
                              Number(formatCurrency(a[flag]).replaceAll(",", ""))
                      )
                : list
                      .map((item) => item)
                      .sort(
                          (a, b) =>
                              Number(formatCurrency(a[flag]).replaceAll(",", "")) -
                              Number(formatCurrency(b[flag]).replaceAll(",", ""))
                      );

            dispatch(updateList(updateListItems));
        }
    };

    useEffect(() => {
        (async () => {
            return await getLiquidationData(true);
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, transaction, networkId]);

    return (
        <Container>
            <TableContainer style={{ overflowY: "hidden", maxHeight: "70vh" }}>
                <StyledTHeader>
                    <Row>
                        <AmountCell
                            onClick={() => {
                                setSortList({ ...sortList, cRatio: !sortList.cRatio });
                                sortListHandler(sortList.cRatio, "cRatio");
                                setNeutral(1);
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            <H4 $weight={"b"}>
                                C-ratio {neutral === 1 ? !sortList.cRatio ? <span>&#9650;</span> : <span>&#9660;</span> : " -"}
                            </H4>
                        </AmountCell>
                        <AmountCell
                            onClick={() => {
                                setSortList({ ...sortList, debt: !sortList.debt });
                                sortListHandler(sortList.debt, "debt");
                                setNeutral(2);
                            }}
                            style={{ display: "flex", cursor: "pointer", justifyContent: "center" }}
                        >
                            <H4 style={{ display: "flex", justifyContent: "center" }} $weight={"b"}>
                                Debt {neutral === 2 ? sortList.debt ? <span>&#9650;</span> : <span>&#9660;</span> : " -"}
                            </H4>
                        </AmountCell>
                        <AmountCell>
                            <H4
                                $weight={"b"}
                                style={{
                                    display: "flex",
                                    width: "30rem",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    const obj = {};
                                    obj[selected.toLowerCase()] = !sortList[selected.toLowerCase()];
                                    setSortList({ ...sortList, ...obj });
                                    sortListHandler(
                                        sortList[selected.toLowerCase()],
                                        selected.toUpperCase() === "PERI" ? "Peri" : selected.toUpperCase()
                                    );
                                    setNeutral(3);
                                }}
                            >
                                Collateral
                                {neutral === 3 ? (
                                    sortList[selected.toLowerCase()] ? (
                                        <span>&#9650;</span>
                                    ) : (
                                        <span>&#9660;</span>
                                    )
                                ) : (
                                    " -"
                                )}
                                {!drop ? (
                                    <SmallDropBox>
                                        <img
                                            src={`/images/currencies/${selected.toUpperCase()}.png`}
                                            alt="PERI"
                                            style={{ width: "17px", marginLeft: "6px" }}
                                            onClick={() => setDrop(!drop)}
                                        />
                                    </SmallDropBox>
                                ) : (
                                    <SmallDropBox>
                                        <img
                                            src={`/images/currencies/PERI.png`}
                                            onClick={() => {
                                                setSortList({ ...sortList, peri: !sortList.peri });
                                                sortListHandler(sortList.peri, "Peri");
                                                setSelected("Peri");
                                                setDrop(!drop);
                                            }}
                                            alt="PERI"
                                            style={{ width: "17px", marginLeft: "6px" }}
                                        />
                                        <img
                                            src={`/images/currencies/DAI.png`}
                                            onClick={() => {
                                                setSortList({ ...sortList, dai: !sortList.dai });
                                                sortListHandler(sortList.dai, "DAI");
                                                setSelected("DAI");
                                                setDrop(!drop);
                                            }}
                                            alt="DAI"
                                            style={{ width: "17px", marginLeft: "6px" }}
                                        />
                                        <img
                                            src={`/images/currencies/USDC.png`}
                                            onClick={() => {
                                                setSortList({ ...sortList, usdc: !sortList.usdc });
                                                sortListHandler(sortList.usdc, "USDC");
                                                setSelected("USDC");
                                                setDrop(!drop);
                                            }}
                                            alt="USDC"
                                            style={{ width: "17px", marginLeft: "6px" }}
                                        />
                                    </SmallDropBox>
                                )}
                            </H4>
                        </AmountCell>
                        <AmountCell>
                            <H4 $weight={"b"}>Status</H4>
                        </AmountCell>
                        <AmountCell>
                            <H4 $weight={"b"}>Action</H4>
                        </AmountCell>
                    </Row>
                </StyledTHeader>
                <StyledTBody>
                    {list.map((el, idx) => {
                        return (
                            <BorderRow key={`row${idx}`} style={{ minHeight: "9rem", height: "10rem" }}>
                                <AmountCell>
                                    <H4 $weight={"m"}>{`${ratioToPer(el.cRatio)}%`}</H4>
                                </AmountCell>
                                <AmountCell>
                                    <H4 $weight={"m"}>{`${formatCurrency(el.debt)} pUSD`}</H4>
                                </AmountCell>
                                <AmountCell style={{ width: "30rem" }}>
                                    <CollateralList>
                                        {el.collateral.map((item, idx) => {
                                            return (
                                                <Image key={`image${idx}`}>
                                                    <img src={`/images/currencies/${item.name.toUpperCase()}.png`} alt="" />
                                                    <span>{`${item.name} ${
                                                        item.name === "Peri"
                                                            ? isNaN(item.value)
                                                                ? 0
                                                                : formatCurrency(item.value)
                                                            : formatCurrency(item.value)
                                                    }`}</span>
                                                </Image>
                                            );
                                        })}
                                    </CollateralList>
                                </AmountCell>
                                <AmountCell>
                                    <H4 $weight={"m"}>{statusList[el.status]}</H4>
                                </AmountCell>
                                <AmountCell style={{ position: "relative" }}>
                                    {el.status === 0 && (
                                        <TakeBtn onClick={() => toggleModal(idx)} $toggle={balances["pUSD"].balance < el.debt}>
                                            Take
                                        </TakeBtn>
                                    )}

                                    {el.toggle && (
                                        <TakeModal
                                            idx={idx}
                                            address={el.address}
                                            list={list}
                                            dispatch={dispatch}
                                            contracts={contracts}
                                            debt={formatCurrency(el.debt)}
                                            collateral={el.collateral}
                                            toggleModal={(idx) => toggleModal(idx)}
                                            cRatio={`${ratioToPer(el.cRatio)}%`}
                                        ></TakeModal>
                                    )}
                                </AmountCell>
                            </BorderRow>
                        );
                    })}
                </StyledTBody>
            </TableContainer>
        </Container>
    );
};

const AmountCell = styled(Cell)`
    max-width: 100%;
    display: flex;
    justify-content: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const Container = styled.div`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
    flex-direction: column;
    justify-content: center;
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

const CollateralList = styled.ul`
    display: flex;
    justify-content: flex-start;
    width: 30rem;
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

interface ITakeBtn {
    $toggle: boolean;
}

const TakeBtn = styled.button<ITakeBtn>`
    outline: none;
    border: none;
    border-radius: 14px;
    background: #4182f0;
    /* filter: ${(props) => props.$toggle && "brightness(65%)"}; */
    color: white;
    font-weight: bold;
    width: 5.5rem;
    padding: 0.5rem 0;
`;

const SmallDropBox = styled.div`
    display: flex;
    width: fit-content;
    padding: 5px 6px;
    background: #252a3e;
    border-radius: 13px;
    margin-left: 5px;
    position: absolute;
    right: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    img {
        margin-right: 3px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
`;

export default Liquidation;
