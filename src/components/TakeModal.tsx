import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";

import { RootState } from "config/reducers";

import { getTake } from "lib/liquidation/getTake";
import { formatCurrency } from "lib/format";
import { utils } from "ethers";
import { setLoading } from "config/reducers/loading";

const onMouseOverHandler = (pUSD, debt) => {
	pUSD < debt && NotificationManager.error(`Not enough pUSD`, "ERROR");
};

const TakeModal = ({ idx, address, list, dispatch, contracts, debt, collateral, toggleModal }) => {
	console.log("TAKE MODAL parameter", idx, address, list, debt, collateral);
	const { balances }: any = useSelector((state: RootState) => state.balances);
	const { gasPrice } = useSelector((state: RootState) => state.networkFee);

	const [value, setValue] = useState("0");
	const [gas, setGas] = useState("0");
	const [profit, setProfit] = useState("0");
	const [sumCollateral, setSumCollateral] = useState("0");

	const maxBalance = balances.pUSD.transferable;

	const modalRef = useRef<any>();
	const closeModalHandler = (e) => {
		if (list[idx].toggle && !modalRef.current.contains(e.target)) toggleModal(idx);
	};

	const getProfit = useCallback(() => {
		// const D = Number(debt);
		// const V = Number(sumCollateral);

		// const amountToFixRatioinUSD = V + D;
		// let amountToLiquidate =
		// 	amountToFixRatioinUSD < Number(value.replaceAll(",", "")) ? amountToFixRatioinUSD : Number(value.replaceAll(",", ""));
		// const totalRedeemedinUSD = amountToLiquidate * 1.1;

		// if (totalRedeemedinUSD > V) {
		// 	amountToLiquidate = V / 0.725;
		// }
		// console.log(amountToLiquidate * 1.1);
		// setProfit((amountToLiquidate * 1.1).toFixed(4));
		setProfit((Number(value.replaceAll(",", "")) * 1.1).toFixed(4));
	}, [value]);

	const sumCollateralHandler = async () => {
		const collateral = {
			Peri: BigInt((await contracts.ExchangeRates.rateForCurrency(utils.formatBytes32String("PERI"))).toString()),
			USDC: BigInt((await contracts.ExchangeRates.rateForCurrency(utils.formatBytes32String("USDC"))).toString()),
			Dai: BigInt((await contracts.ExchangeRates.rateForCurrency(utils.formatBytes32String("DAI"))).toString()),
		};

		const peri = (BigInt(list[idx].collateral[0].value) * BigInt(collateral.Peri)) / 10n ** 18n;
		const dai = (BigInt(list[idx].collateral[1].value) * BigInt(collateral.Dai)) / 10n ** 18n;
		const usdc = (BigInt(list[idx].collateral[2].value) * BigInt(collateral.USDC)) / 10n ** 18n;

		setSumCollateral(formatCurrency(peri + dai + usdc));
	};

	const getGasPrice = async () => {
		const convertValue = utils.parseEther(value.replaceAll(",", ""));
		const estimateGas = await contracts.signers.PeriFinance.estimateGas.liquidateDelinquentAccount(
			list[idx].address,
			BigInt(convertValue.toString())
		);
		setGas(utils.formatEther((BigInt(estimateGas.toString()) * BigInt(gasPrice)).toString()));
	};

	const getMaxAmount = (per = 1) => {
		return Number(formatCurrency(maxBalance).replaceAll(",", "")) > Number(debt.replaceAll(",", ""))
			? String(debt.replaceAll(",", "") * per)
			: String(formatCurrency(maxBalance).replaceAll(",", "") * per);
	};

	useEffect(() => {
		dispatch(setLoading({ name: "liquidation", value: true }));
		sumCollateralHandler();
		getGasPrice();
		dispatch(setLoading({ name: "liquidation", value: false }));
	}, []);

	useEffect(() => {
		dispatch(setLoading({ name: "liquidation", value: true }));
		getProfit();
		dispatch(setLoading({ name: "liquidation", value: false }));
	}, [value]);

	useEffect(() => {
		window.addEventListener("click", closeModalHandler);
		return () => {
			window.removeEventListener("click", closeModalHandler);
		};
	}, []);

	return (
		<TakeModalItem>
			<Area ref={modalRef}>
				<InputBox>
					<SubIndicator>
						<span>{`Available: ${formatCurrency(maxBalance)}`}</span>
						<span>{`Gas Fee: ${gas}`}</span>
					</SubIndicator>
					<img src={`/images/currencies/pUSD.png`} alt="pUSD" />
					<TakeInput
						type="number"
						placeholder="0"
						min="0"
						max={getMaxAmount()}
						step="0.01"
						value={value === "0" ? "" : value}
						autoFocus={true}
						onChange={(e) => setValue(e.target.value)}
					/>
					<MaxBtn onClick={() => setValue(getMaxAmount())}>max</MaxBtn>
				</InputBox>

				<TakeSlider
					type="range"
					min="0"
					max={getMaxAmount()}
					step="0.01"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<TakePercentage>
					<span onClick={() => setValue("0")}>0%</span>
					<span
						onClick={() => {
							setValue(getMaxAmount(0.25));
						}}
					>
						25%
					</span>
					<span onClick={() => setValue(getMaxAmount(0.5))}>50%</span>
					<span onClick={() => setValue(getMaxAmount(0.75))}>75%</span>
					<span onClick={() => setValue(getMaxAmount())}>100%</span>
				</TakePercentage>

				<ContentSection>
					<div style={{ display: "flex" }}>
						<ContentBox>
							<span className="title">{`Debt ( $ ${debt} )`}</span>
							<span className="content">
								<span>
									<img className="icon" src={`/images/currencies/pUSD.png`} alt="pUSD" />
									{debt.toString()}
								</span>
							</span>
						</ContentBox>
						<ContentBox>
							<span className="title">{`Estimate Profit`}</span>
							<span className="content">
								<span>{`${value === "0" ? "0" : profit} USD`}</span>
							</span>
						</ContentBox>
					</div>
					<ContentBox>
						<span className="title">{`Collateral ( $ ${sumCollateral} )`}</span>
						<span className="content">
							{collateral.map((item) => {
								return (
									<span key={`collateral_${item.name}`}>
										<img
											className="icon"
											src={`/images/currencies/${item.name.toUpperCase()}.png`}
											alt={item.name.toUpperCase()}
										/>
										<span>{`${item.name} ${
											item.name === "Peri" ? (isNaN(item.value) ? 0 : formatCurrency(item.value)) : formatCurrency(item.value)
										}`}</span>
									</span>
								);
							})}
						</span>
					</ContentBox>
				</ContentSection>

				<SubmitBtn
					onClick={() =>
						maxBalance < debt
							? onMouseOverHandler(value, debt)
							: getTake(value, idx, address, list, dispatch, contracts, balances, toggleModal)
					}
				>
					TAKE
				</SubmitBtn>
			</Area>
		</TakeModalItem>
	);
};

const TakeModalItem = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	right: 0;
	z-index: 2;
	background: #525252a1;
`;

const Area = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	width: 50rem;
	height: 55rem;
	border-radius: 20px;
	padding: 7px;
	background: #262a3c;
	color: #fefffe;
	font-weight: bold;
`;

const TakeSlider = styled.input`
	width: 35rem;
	height: fit-content;
`;

const TakePercentage = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 31rem;
	font-size: 1.1rem;
	margin-bottom: 3rem;

	span {
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
`;

const InputBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 25rem;
	height: 5rem;
	padding: 3px 8px;
	border-radius: 35px;
	background: #0e101e;
	position: relative;
	margin-top: 10rem;
	margin-bottom: 3rem;

	img {
		width: 20px;
	}
`;

const SubIndicator = styled.div`
	display: flex;
	justify-content: space-between;
	width: 80%;
	position: absolute;
	top: -18px;
`;

const TakeInput = styled.input`
	width: 11rem;
	height: fit-content;
	background: #525252;
	outline: none;
	border: none;
	color: #fefffe;
	text-align: right;
	font-size: 3em;
	font-weight: bold;
	background: #0e101e;

	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

const MaxBtn = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 3.5rem;
	height: 2rem;
	background: #2184f8;
	box-shadow: 0px 3.5px 0px 0px #1158a9d2;
	border: none;
	border-radius: 6px;
	outline: none;
	color: #fefffe;
	font-size: 1.2rem;

	&:hover {
		transition: 0.2s ease-in-out;
		margin-top: 2.5px;
		box-shadow: none;
	}
`;

const ContentSection = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	width: 30rem;
`;

const ContentBox = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 1.3rem;
	margin-right: 4rem;
	margin-bottom: 1.5rem;

	img {
		width: 14px;
		margin-right: 6px;
	}

	.title {
		font-weight: bold;
		margin-bottom: 7px;
	}

	.content {
		display: flex;
		flex-direction: column;

		span {
			display: flex;
			align-items: center;
			margin-bottom: 0.7rem;
		}
	}
`;

const SubmitBtn = styled.button`
	width: 20rem;
	height: 6.5rem;
	border: none;
	border-radius: 6px;
	padding: none;
	margin: none;
	background: #2184f8;
	box-shadow: 0px 3.5px 0px 0px #1158a9d2;
	color: #fefffe;
	font-size: 3rem;

	&:hover {
		transition: 0.2s ease-in-out;
		margin-top: 2.5px;
		box-shadow: none;
	}
`;

export default TakeModal;
