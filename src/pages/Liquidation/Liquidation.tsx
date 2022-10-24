import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { RootState } from "config/reducers";
import { setLoading } from "config/reducers/loading";

import { contracts } from "lib/contract";
import { formatCurrency } from "lib";
import { getLiquidationList } from "lib/liquidation";

import { StyledTHeader, StyledTBody, Row, Cell, BorderRow } from "components/Table";
import { H4 } from "components/heading";
import TakeModal from "components/TakeModal";
import { updateList } from "config/reducers/liquidation";

// ! test handler

const testHandler = async (address: string) => {
	const { PeriFinance } = contracts as any;

	console.log("TEST console", "address", address);
	// const debt = BigInt(await PeriFinance.debtBalanceOf(address, utils.formatBytes32String("pUSD")));
	// const daiKey = utils.formatBytes32String("DAI");
	// const usdcKey = utils.formatBytes32String("USDC");

	const peri = async () => {
		return await PeriFinance.collateral(address);
	};

	// await peri().then((el) => console.log("TEST console", "PERI", el.toString()));
	const strPeri = await peri();
	console.log("TEST console", "peri", PeriFinance, formatCurrency(strPeri.toString()));

	// const USDC = async () => {
	// 	return await contracts.ExternalTokenStakeManager.stakedAmountOf(address, usdcKey, usdcKey);
	// };

	// await USDC().then((el) => console.log("test console", "USDC", el.toString()));

	// const DAI = async () => {
	// 	return await contracts.ExternalTokenStakeManager.stakedAmountOf(address, daiKey, daiKey);
	// };
	// await DAI().then((el) => console.log("test console", "DAI", el.toString()));

	// console.log("test console", "debt", debt);
};

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

	useEffect(() => {
		(async () => {
			return await getLiquidationData(true);
		})();
		// eslint-disable-next-line
	}, [address, networkId, transaction]);

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
							<BorderRow key={`row${idx}`} style={{ minHeight: "9rem", height: "10rem" }}>
								<AmountCell>
									<H4 weight={"m"}>{`${ratioToPer(el.cRatio)}%`}</H4>
								</AmountCell>
								<AmountCell>
									<H4 weight={"m"}>{`${formatCurrency(el.debt)} pUSD`}</H4>
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
									<H4 weight={"m"}>{statusList[el.status]}</H4>
								</AmountCell>
								<AmountCell style={{ position: "relative" }}>
									{/* TEMP CLOSE */}
									{/* {el.status === 0 && ( */}
									<TakeBtn onClick={() => toggleModal(idx)} toggle={balances["pUSD"].balance < el.debt}>
										Take
									</TakeBtn>
									{/* )} */}

									{/* TEST BTN */}
									<div
										style={{ width: "3px", height: "3px", color: "white", cursor: "pointer" }}
										onClick={() => testHandler(el.address)}
									>
										TEST Btn
									</div>
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
	toggle: boolean;
}

const TakeBtn = styled.button<ITakeBtn>`
	outline: none;
	border: none;
	background: #505050;
	filter: ${(props) => props.toggle && "brightness(65%)"};
	color: white;
	font-weight: bold;
	width: 5.5rem;
	padding: 0.5rem 0;
`;

export default Liquidation;
