import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { contracts } from "lib/contract";
import { H1, H4 } from "components/heading";
import { StyledTHeader, StyledTBody, Row, BorderRow } from "components/table";
import { NotificationManager } from "react-notifications";
import {
  Container,
  TableContainer,
  Title,
  ShortCell,
  Image,
  AmountCell,
  TakeBtn,
} from "pages/Liquidation/Liquidation";

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
      <Title>
        <H1>ESCROWED REWARD</H1>
      </Title>
      <TableContainer style={{ overflowY: "hidden", maxHeight: "70vh" }}>
        <StyledTHeader>
          <Row>
            <ShortCell>
              <H4 $weight={"b"}>Index</H4>
            </ShortCell>
            <AmountCell>
              <H4 $weight={"b"}>Escrow amount</H4>
            </AmountCell>
            <MiddleCell>
              <H4 $weight={"b"}>Time</H4>
            </MiddleCell>
          </Row>
        </StyledTHeader>
        <StyledTBody>
          {escrowList.map((item, idx: number) => {
            return (
              <EscrowBodyRow key={`row${idx}`}>
                <ShortCell>
                  <H4 style={{ color: !item.toggle && "#505050" }} $weight={"m"}>
                    {idx + 1}
                  </H4>
                </ShortCell>
                <AmountCell>
                  <EscrowImage $toggle={item.toggle}>
                    <img src={`/images/currencies/PERI.png`} alt="" />
                    <span>{`${item.amount}`}</span>
                  </EscrowImage>
                </AmountCell>
                <MiddleCell $toggle={item.toggle}>
                  <H4 $weight={"m"}>{item.endTime === "0" ? "-" : item.endTime}</H4>
                </MiddleCell>
              </EscrowBodyRow>
            );
          })}
        </StyledTBody>
      </TableContainer>
      <AvailableAmount>total withdrawable amount: {sumAmount()}</AvailableAmount>
      <EscrowBtn onClick={() => getEscrowHandler(contracts)}>To My Wallet</EscrowBtn>
    </Container>
  );
};

// const AmountCell = styled(Cell)`
//     max-width: 100%;
//     display: flex;
//     justify-content: center;
//     padding: 0 25px;
// `;

// const Container = styled.div`
//     display: flex;
//     height: 80vh;
//     width: 100%;
//     flex-direction: column;
//     justify-content: flex-start;

//     ${({ theme }) => theme.media.mobile`
//         height: 45vh;
//     `}
// `;

const AvailableAmount = styled(H4)`
  display: flex;
  width: 90%;
  justify-content: flex-end;

  ${({ theme }) => theme.media.mobile`
        width: 99%;
    `}
`;

const MiddleCell = styled(AmountCell)<{ $toggle?: boolean }>`
  min-width: 180px;
  max-width: 220px;

  h4 {
    color: ${(props) =>
      props.$toggle === undefined || props.$toggle === true
        ? props.theme.colors.font.primary
        : props.theme.colors.font.tertiary};
  }

  ${({ theme }) => theme.media.mobile`
        min-width: 80px;
        max-width: 120px;
    `}
`;

const EscrowImage = styled(Image)<{ $toggle: boolean }>`
  img {
    opacity: ${(props) => (props.$toggle === undefined || props.$toggle === true ? "1" : "0.5")};
  }

  span {
    color: ${(props) =>
      props.$toggle === undefined || props.$toggle === true
        ? props.theme.colors.font.primary
        : props.theme.colors.font.tertiary};
  }
`;

const EscrowBodyRow = styled(BorderRow)`
  min-height: 50px;

  ${({ theme }) => theme.media.mobile`
        min-height: 40px;
    `}
`;

// const Title = styled.div`
//     z-index: 0;
//     justify-content: flex-start;

//     h1 {
//         width: fit-content;
//         margin-left: 70px;
//     }
// `;

// const TableContainer = styled.div`
//     z-index: 1;
//     border-radius: 25px;
//     height: 40%;
//     margin: 0 70px;
//     padding: 50px 40px;
//     background-color: ${(props) => props.theme.colors.background.panel};
//     box-shadow: ${(props) => `0px 0px 25px ${props.theme.colors.border.primary}`};
//     border: ${(props) => `2px solid ${props.theme.colors.border.primary}`};

//     ${({ theme }) => theme.media.mobile`
//         margin: 0;
//         width: 99%;
//         height: 85%;
//         overflow-y: hidden;
//         overflow-x: auto;
//         padding: 0;
//         border-radius: 5px;
//     `}
// `;

// const Image = styled.li`
//     display: flex;
//     align-items: center;
//     margin-right: 1.125rem;

//     img {
//         width: 20px;
//         height: 20px;
//         margin-right: 0.3rem;
//     }

//     span {
//         color: white;
//         font-size: 0.8125rem;
//     }
// `;

const EscrowBtn = styled(TakeBtn)`
  margin-top: 40px;
  margin-left: 70px;
  width: 86%;

  ${({ theme }) => theme.media.mobile`
      margin: 20px auto 0px auto;
      width: 90%;
  `}
`;

export default Escrow;
