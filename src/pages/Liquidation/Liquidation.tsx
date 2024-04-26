import React, { useCallback, useEffect, useRef, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

import { RootState } from "config/reducers";

import { contracts } from "lib/contract";
import { formatCurrency } from "lib";
import { getLiquidationList } from "lib/liquidation";

import { StyledTHeader, StyledTBody, Row, Cell, BorderRow } from "components/table";
import { H1, H4 } from "components/heading";
import TakeModal from "pages/Liquidation/TakeModal";

import { setListReady, updateList } from "config/reducers/liquidation";

const Liquidation = () => {
  const dispatch = useDispatch();
  const balanceReady = useSelector((state: RootState) => state.balances.isReady);
  const { balances } = useSelector((state: RootState) => state.balances);
  const { address, networkId, isConnect } = useSelector((state: RootState) => state.wallet);
  const { listReady, list } = useSelector((state: RootState) => state.liquidation);
  const transaction = useSelector((state: RootState) => state.transaction);
  // const [ list, setList] = useState([]);
  const [sortList, setSortList] = useState({
    cRatio: true,
    debt: false,
    PERI: false,
    DAI: false,
    USDC: false,
    USDT: false,
    PAXG: false,
    XAUT: false,
  });
  const [neutral, setNeutral] = useState(1);
  const [selected, setSelected] = useState("PERI");
  const [drop, setDrop] = useState(false);

  const statusList = ["Open", "Taken", "Closed"];

  const ratioToPer = (originValue) => {
    const value = BigInt(originValue);
    if (value === 0n) return "0";
    return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
  };

  const getLiquidationData = useCallback(
    async (isLoading) => {
      // dispatch(setLoading({ name: "liquidation", value: isLoading }));
      dispatch(setListReady(false));
      try {
        if (balanceReady && address) {
          const stakeTokens = {};
          Object.keys(balances)
            .filter((item) => balances[item].staking)
            .map((item) => (stakeTokens[item] = balances[item]));
          await getLiquidationList(dispatch, stakeTokens, networkId);
        }
      } catch (e) {
        console.log("getLiquidation error", e);
        dispatch(setListReady(true));
      }

      // dispatch(setLoading({ name: "liquidation", value: false }));
    },
    [dispatch, balanceReady, address, balances, networkId]
  );

  const toggleModal = (flag: number) => {
    const updateListItems = list.map((item, idx) => {
      return flag === idx ? { ...item, toggle: !item.toggle } : item;
    });
    // console.log(updateListItems);
    // console.log(flag);
    dispatch(updateList(updateListItems));
  };

  const sortListHandler = (direction: boolean, flag: string) => {
    // "asc", "desc";
    /* if (flag === "PERI" || flag === "USDC" || flag === "DAI") {
      let flagIdx = 0;
      switch (flag) {
        case "PERI":
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
      } */

    const flagIdx =
      list.length > 0 ? list[0].collateral?.findIndex((item) => item.name === flag) : -1;
    if (flagIdx !== -1) {
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
      return await getLiquidationData(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, transaction, networkId, balanceReady]);

  const netRef = useRef<HTMLDivElement>(null);
  const closeModalHandler = useCallback(
    (e) => {
      if (drop && e.target.id !== "drop_caller" && !netRef.current?.contains(e.target)) {
        setDrop(false);
      }
    },
    [drop]
  );

  useEffect(() => {
    window.addEventListener("click", closeModalHandler);
    return () => {
      window.removeEventListener("click", closeModalHandler);
    };
  }, [closeModalHandler]);

  return (
    <Container>
      <Title>
        <H1>LIQUIDATION</H1>
      </Title>
      <TableContainer style={{ overflowY: "hidden", maxHeight: "70vh" }}>
        <TableHeader>
          <ShortCell
            onClick={() => {
              setSortList({ ...sortList, cRatio: !sortList.cRatio });
              sortListHandler(sortList.cRatio, "cRatio");
              setNeutral(1);
            }}
            style={{ cursor: "pointer" }}
          >
            <H4 $weight={"b"}>
              Cratio{" "}
              {neutral === 1 ? (
                !sortList.cRatio ? (
                  <span>&#9650;</span>
                ) : (
                  <span>&#9660;</span>
                )
              ) : (
                " -"
              )}
            </H4>
          </ShortCell>
          <LongCell style={{ display: "flex", cursor: "pointer", justifyContent: "center" }}>
            <H4
              onClick={() => {
                setSortList({ ...sortList, debt: !sortList.debt });
                sortListHandler(sortList.debt, "debt");
                setNeutral(2);
              }}
              style={{ display: "flex", justifyContent: "center" }}
              $weight={"b"}
            >
              Debt{" "}
              {neutral === 2 ? sortList.debt ? <span>&#9650;</span> : <span>&#9660;</span> : " -"}
            </H4>
          </LongCell>
          <LongCell>
            <DropH4
              $weight={"b"}
              style={{
                display: "flex",
                width: "10rem",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => {
                const obj = {};
                obj[selected.toUpperCase()] = !sortList[selected.toUpperCase()];
                setSortList({ ...sortList, ...obj });
                sortListHandler(sortList[selected.toUpperCase()], selected.toUpperCase());
                setNeutral(3);
              }}
            >
              {!drop && "Col"}
              {!drop ? (
                neutral === 3 ? (
                  sortList[selected.toUpperCase()] ? (
                    <span>&#9650;</span>
                  ) : (
                    <span>&#9660;</span>
                  )
                ) : (
                  " -"
                )
              ) : null}
              {!drop ? (
                <ImgDropBox>
                  <img
                    id="drop_caller"
                    src={`/images/currencies/${selected.toUpperCase()}.png`}
                    alt="PERI"
                    onClick={(event) => {
                      setDrop(!drop);
                      if (event.stopPropagation) event.stopPropagation();
                    }}
                  />
                </ImgDropBox>
              ) : (
                <ImgDropList>
                  {Object.keys(sortList).map(
                    (key) =>
                      !["cRatio", "debt"].includes(key) && (
                        <img
                          key={key}
                          src={`/images/currencies/${key}.png`}
                          onClick={() => {
                            const sList = { ...sortList };
                            sList[key] = true;
                            if (key !== selected) sList[selected] = false;
                            console.log(sList, selected, key);
                            setSortList(sList);

                            sortListHandler(sortList[key], key);
                            setSelected(key);
                            setDrop(!drop);
                          }}
                          alt={key}
                        />
                      )
                  )}
                  {/* <img
                    src={`/images/currencies/DAI.png`}
                    onClick={() => {
                      setSortList({ ...sortList, dai: !sortList.dai });
                      sortListHandler(sortList.dai, "DAI");
                      setSelected("DAI");
                      setDrop(!drop);
                    }}
                    alt="DAI"
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
                  /> */}
                </ImgDropList>
              )}
            </DropH4>
          </LongCell>
          <ShortCell>
            <H4 $weight={"b"}>Status</H4>
          </ShortCell>
          <ShortCell>
            <H4 $weight={"b"}>Action</H4>
          </ShortCell>
        </TableHeader>
        <TableBody $center={isConnect && !listReady}>
          {isConnect ? (
            !listReady ? (
              <ContainerLoadingSpinner />
            ) : (
              list.map((el, idx) => {
                if (el.status === 2) return null;
                let i = 0;
                return (
                  <BodyRow key={`row${idx}`}>
                    <ShortCell>
                      <H4 $weight={"m"}>{`${ratioToPer(el.cRatio)}%`}</H4>
                    </ShortCell>
                    <LongCell>
                      <H4 $weight={"m"}>{`$${formatCurrency(el.debt)}`}</H4>
                    </LongCell>
                    <LongCell /* style={{ width: "100px" }} */>
                      <CollateralList>
                        {el.collateral.map((item, idx) => {
                          if (i++ < 3)
                            return (
                              item.value > 0 && (
                                <Image key={`image${idx}`}>
                                  <img
                                    src={`/images/currencies/${item.name.toUpperCase()}.png`}
                                    alt=""
                                  />
                                  <span>
                                    {`${isNaN(item.value) ? 0 : formatCurrency(item.value)}`}
                                  </span>
                                </Image>
                              )
                            );
                          else if (el.collateral > 4 && i === 4)
                            return (
                              item.value > 0 && (
                                <Image key={`image${idx}`}>
                                  <span>{"･･･"}</span>
                                </Image>
                              )
                            );
                        })}
                      </CollateralList>
                    </LongCell>
                    <ShortCell>
                      <H4 $weight={"m"}>{statusList[el.status]}</H4>
                    </ShortCell>
                    <ActionCell style={{ position: "relative" }}>
                      {el.status === 0 && <TakeBtn onClick={() => toggleModal(idx)}>Take</TakeBtn>}

                      {/* {el.toggle && (
                        <TakeModal
                          idx={idx}
                          address={el.address}
                          list={list}
                          dispatch={dispatch}
                          contracts={contracts}
                          debt={el.debt}
                          exEA={el.exEA}
                          collateral={el.collateral}
                          toggleModal={toggleModal}
                          cRatio={`${ratioToPer(el.cRatio)}%`}
                        ></TakeModal>
                      )} */}
                    </ActionCell>
                    {el.toggle && (
                        <TakeModal
                          idx={idx}
                          address={el.address}
                          list={list}
                          dispatch={dispatch}
                          contracts={contracts}
                          debt={el.debt}
                          exEA={el.exEA}
                          collateral={el.collateral}
                          toggleModal={toggleModal}
                          cRatio={`${ratioToPer(el.cRatio)}%`}
                        ></TakeModal>
                      )}
                  </BodyRow>
                );
              })
            )
          ) : null}
        </TableBody>
      </TableContainer>
    </Container>
  );
};

export const ContainerLoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #262a3c;
  border-radius: 50%;
  border-top-color: #4182f0;
  border-left-color: #4182f0;
  border-right-color: #4182f0;
  margin: 30px;
  animation: spin 0.8s infinite ease-in-out;

  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
`;

export const Title = styled.div`
  z-index: 0;
  justify-content: flex-start;

  h1 {
    width: fit-content;
    // margin-left: 70px;
  }

  ${({ theme }) => theme.media.mobile`
    top: -10px;
    justify-content: center;

    h1 {
      width: 100%;
      margin-left: 0px;
    }
  `}
`;

const BodyRow = styled(BorderRow)`
  min-height: 80px;

  ${({ theme }) => theme.media.mobile`
    min-height: 60px;
  `}
`;

export const AmountCell = styled(Cell)`
  max-width: 100%;
  display: flex;
  justify-content: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const ShortCell = styled(AmountCell)`
  min-width: 60px;
  width: 16%;
  h4 {
    text-align: center;
  }

  ${({ theme }) => theme.media.mobile`
    min-width: 48px;
  `}
`;

const ActionCell = styled(Cell)`
  position: relative;
  min-width: 60px;
  width: 16%;

  ${({ theme }) => theme.media.mobile`
    min-width: 50px;
    margin: 0;
  `}
`;

const LongCell = styled(AmountCell)`
  min-width: 150px;
  width: 22%;
  overflow: visible;

  ${({ theme }) => theme.media.mobile`
    min-width: 70px;
  `}
`;

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  ${({ theme }) => theme.media.mobile`
		// height: 45vh;
	`}
`;

export const TableContainer = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  height: 60%;
  width: 80%;
  margin: 0 70px;
  background-color: ${(props) => props.theme.colors.background.body};
  box-shadow: ${(props) => `0px 0px 25px ${props.theme.colors.border.primary}`};
  border: ${(props) => `2px solid ${props.theme.colors.border.primary}`};

  ${({ theme }) => theme.media.mobile`
    margin: 0;
    width: 90%;
    height: 85%;
    min-height: 100px;
    overflow-y: hidden;
    overflow-x: auto;
    padding: 0;
    border-radius: 5px;
`}

  ${({ theme }) => theme.media.tablet`
    width: 85%;
    height: 85%;
  `}
`;

export const TableBody = styled(StyledTBody)<{ $center?: boolean }>`
  justify-content: ${(props) => (props.$center ? "center" : "flex-start")};
  align-items: center;
  width: 100%;
`;

export const TableHeader = styled(StyledTHeader)`
  overflow: visible;
  width: 100%;
`;

const CollateralList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
`;

export const Image = styled.li`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 90px;
  height: 15px;
  margin: 0px 10px;
  // margin-right: 1.8rem;

  img {
    margin-right: 5px;
    width: 12px;
    height: 12px;
  }

  span {
    color: white;
    font-size: 0.7rem;
  }

  ${({ theme }) => theme.media.mobile`
    width: 70px;
    height: 16px;
    img {
      width: 12px;
      height: 12px;
    }

    span {
      font-size: 0.7rem;
    }
  `}
`;

// interface ITakeBtn {
//     $toggle: boolean;
// }

export const TakeBtn = styled.button/* <ITakeBtn> */ `
  border-radius: 25px;
  color: white;
  font-weight: bold;
  height: fit-content;
  width: 5rem;
  padding: 0.5rem 0;
  margin: 0.2rem 1rem;
  background: ${({ theme }) => theme.colors.background.body};
  border: ${({ theme }) => `1px solid ${theme.colors.border.tableRow}`};
  box-shadow: ${({ theme }) => `0px 1.5px 0px ${theme.colors.border.primary}`};

  &:hover {
    transition: 0.2s ease-in-out;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => `0.5px 3px 0px ${theme.colors.border.primary}`};
  }

  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  ${({ theme }) => theme.media.mobile`
    width: 3rem;
    padding: 0.5rem 0;
    font-size: 0.7rem; 
    margin: 0.3rem 0;
  `}
`;

const ImgDropBox = styled.div`
  display: flex;
  left: 0px;
  position: relative;
  width: fit-content;
  height: fit-content;
  background: transparent;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  img {
    margin: 3px 3px;
    width: 17px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

const ImgDropList = styled.div`
  display: flex;
  left: 0px;
  top: 0px;
  z-index: 99;
  flex-direction: row;
  position: relative;
  width: fit-content;
  height: fit-content;
  background: ${({ theme }) => theme.colors.background.body};
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  img {
    margin: 3px 3px;
    width: 17px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

const DropH4 = styled(H4)`
  overflow: visible;
`;

export default Liquidation;
