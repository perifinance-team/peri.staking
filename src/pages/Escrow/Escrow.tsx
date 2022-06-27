import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { contracts } from "lib/contract";
import { H4 } from "components/heading";
import {
	StyledTHeader,
	StyledTBody,
	Row,
	Cell,
	BorderRow,
} from "components/Table";

import { getEscrowList } from "lib/escrow";
import { setLoading } from "config/reducers/loading";

const Escrow = () => {
	const dispatch = useDispatch();
	const [escrowList, setEscrowList] = useState([]);

	const { PeriFinance } = contracts as any;

	const getEscrowListData = useCallback(
		async (isLoading) => {
			dispatch(setLoading({ name: "escrow", value: isLoading }));
			try {
				await getEscrowList(contracts, dispatch, PeriFinance).then((data) =>
					setEscrowList(data)
				);
			} catch (e) {
				console.log("getEscrow error", e);
			}

			dispatch(setLoading({ name: "escrow", value: false }));
		},
		[dispatch]
	);

	useEffect(() => {
		(async () => {
			return await getEscrowListData(true);
		})();
	}, [getEscrowListData, dispatch]);

	return (
		<Container>
			<TableContainer style={{ overflowY: "hidden", maxHeight: "70vh" }}>
				<StyledTHeader>
					<Row>
						<AmountCell>
							<H4 weight={"b"}>Index</H4>
						</AmountCell>
						<AmountCell>
							<H4 weight={"b"}>IDX</H4>
						</AmountCell>
						<AmountCell>
							<H4 weight={"b"} style={{ width: "35rem" }}>
								Collateral amount
							</H4>
						</AmountCell>
						<AmountCell>
							<H4 weight={"b"}>Time</H4>
						</AmountCell>
					</Row>
				</StyledTHeader>
				<StyledTBody>
					{escrowList.map((el, idx) => {
						return (
							<BorderRow
								key={`row${idx}`}
								style={{ minHeight: "9rem", height: "10rem" }}
							>
								<AmountCell>
									<H4 weight={"m"}>{idx + 1}</H4>
								</AmountCell>
								<AmountCell>
									<H4 weight={"m"}>{`oxlx${idx + 2}y`}</H4>
								</AmountCell>
								<AmountCell style={{ width: "35rem" }}>
									<CollateralList>
										{Object.keys(el.collateral).map((item, index) => {
											return (
												<Image key={`escrow${index}`}>
													<img
														src={`/images/currencies/${item.toUpperCase()}.png`}
														alt=""
													/>
													<span>{`${item} ${el.collateral[item]}`}</span>
												</Image>
											);
										})}
									</CollateralList>
								</AmountCell>
								<AmountCell>
									<H4 weight={"m"}>{el.time === 0 ? "-" : el.time}</H4>
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
	width: 35rem;
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

export default Escrow;
