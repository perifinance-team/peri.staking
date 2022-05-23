import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import styled from "styled-components";
import { H4 } from "components/headding";
import {
  StyledTHeader,
  StyledTBody,
  Row,
  Cell,
  BorderRow,
} from "components/Table";
import { formatCurrency } from "lib";
const Liquidation = () => {
  const { balances } = useSelector((state: RootState) => state.balances);
  const { networkId } = useSelector((state: RootState) => state.wallet);
  const { temp } = useSelector((state: RootState) => state.liquidation);

  const statusList = ["Open", "Taken", "Closed"];

  return (
    <Container>
      {/* <Title>
        {" "}
        <H1>TOTAL BALANCE</H1>{" "}
      </Title> */}
      <TableContainer style={{ overflowY: "hidden" }}>
        <StyledTHeader>
          <Row>
            <AmountCell>
              <H4 weigth={"b"} align={"center"}>
                IDX
              </H4>
            </AmountCell>
            <AmountCell>
              <H4 weigth={"b"}>C-ratio</H4>
            </AmountCell>
            <AmountCell>
              <H4 weigth={"b"}>Debt Amount</H4>
            </AmountCell>
            <AmountCell>
              <H4 weigth={"b"} style={{ width: "30rem" }}>
                Collateral amount
              </H4>
            </AmountCell>
            <AmountCell>
              <H4 weigth={"b"}>Status</H4>
            </AmountCell>
            <AmountCell>
              <H4 weigth={"b"}>Action</H4>
            </AmountCell>
          </Row>
        </StyledTHeader>
        <StyledTBody>
          {temp.map((el, idx) => {
            return (
              <BorderRow key={el} style={{ height: "10rem" }}>
                <AmountCell>
                  <H4 weigth={"m"}>{el.idx}</H4>
                </AmountCell>
                <AmountCell>
                  <H4 weigth={"m"}>{el.debt}</H4>
                </AmountCell>
                <AmountCell>
                  <H4 weigth={"m"}>{el.cRatio}</H4>
                </AmountCell>
                <AmountCell style={{ width: "30rem" }}>
                  <CollateralList>
                    {el.collateral.map(
                      (item) =>
                        item.value !== 0 && (
                          <Image>
                            <img
                              src={`/images/currencies/${item.name.toUpperCase()}.png`}
                            ></img>
                            <span>{`${item.name} ${item.value}`}</span>
                          </Image>
                        )
                    )}
                  </CollateralList>
                </AmountCell>
                <AmountCell>
                  <H4 weigth={"m"}>{statusList[el.status]}</H4>
                </AmountCell>
                <AmountCell>
                  {el.status === 0 && <TakeBtn>Take</TakeBtn>}
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

const TakeBtn = styled.button`
  outline: none;
  border: none;
  background: #505050;
  color: white;
  font-weight: bold;
  width: 6rem;
  padding: 0.5rem 0;
`;

export default Liquidation;
