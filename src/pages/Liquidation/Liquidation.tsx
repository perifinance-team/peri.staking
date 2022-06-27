import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";
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
import { formatCurrency } from "lib";
import { getLiquidationList } from "lib/liquidation";
import { setLoading } from "config/reducers/loading";
import { NotificationManager } from "react-notifications";
import { getTake } from "lib/liquidation/getTake";

const Liquidation = () => {
	const dispatch = useDispatch();

	const { balances } = useSelector((state: RootState) => state.balances);
	const { address, networkId } = useSelector(
		(state: RootState) => state.wallet
	);
	const { list } = useSelector((state: RootState) => state.liquidation);

	const statusList = ["Open", "Taken", "Closed"];

	const ratioToPer = (value) => {
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
		[address, networkId, setLoading, dispatch, networkId]
	);

	useEffect(() => {
		(async () => {
			return await getLiquidationData(true);
		})();
	}, [getLiquidationData, dispatch]);

	const onMouseOverHandler = (pUSD, debt) => {
		pUSD < debt && NotificationManager.error(`Not enough pUSD`, "ERROR");
	};

	return (
		<Container>
			<TableContainer style={{ overflowY: "hidden", maxHeight: "70vh" }}>
				<StyledTHeader>
					<Row>
						<AmountCell>
							<H4 weight={"b"}>C-ratio</H4>
						</AmountCell>
						<AmountCell>
							<H4 weight={"b"}>Debt Amount</H4>
						</AmountCell>
						<AmountCell>
							<H4 weight={"b"} style={{ width: "30rem" }}>
								Collateral amount
							</H4>
						</AmountCell>
						<AmountCell>
							<H4 weight={"b"}>Status</H4>
						</AmountCell>
						<AmountCell>
							<H4 weight={"b"}>Action</H4>
						</AmountCell>
					</Row>
				</StyledTHeader>
				<StyledTBody>
					{list.map((el, idx) => {
						return (
							<BorderRow
								key={`row${idx}`}
								style={{ minHeight: "9rem", height: "10rem" }}
							>
								<AmountCell>
									<H4 weight={"m"}>{`${ratioToPer(el.cRatio)}%`}</H4>
								</AmountCell>
								<AmountCell>
									<H4 weight={"m"}>{`${formatCurrency(
										el.debt ? el.debt : 0n
									)} pUSD`}</H4>
								</AmountCell>
								<AmountCell style={{ width: "30rem" }}>
									<CollateralList>
										{el.collateral.map((item, idx) => {
											return (
												<Image key={`image${idx}`}>
													<img
														src={`/images/currencies/${item.name.toUpperCase()}.png`}
														alt=""
													/>
													<span>{`${item.name} ${
														item.name === "Peri"
															? isNaN(item.value.staked)
																? 0
																: item.value.staked
															: formatCurrency(item.value)
													}`}</span>
												</Image>
											);
										})}
									</CollateralList>
								</AmountCell>
								<AmountCell>
									<H4 weight={"m"}>{statusList[el.status]}</H4>
								</AmountCell>
								<AmountCell
									onMouseOver={() =>
										onMouseOverHandler(balances["pUSD"].balance, el.debt)
									}
								>
									{el.status === 0 && (
										<TakeBtn
											onClick={() =>
												getTake(idx, address, list, dispatch, contracts)
											}
											disabled={balances["pUSD"].balance < el.debt}
										>
											Take
										</TakeBtn>
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
	width: 5.5rem;
	padding: 0.5rem 0;
`;

export default Liquidation;
