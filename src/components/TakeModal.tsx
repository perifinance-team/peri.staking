import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

import { getTake } from "lib/liquidation/getTake";
import { formatCurrency } from "lib/format";

const TakeModal = ({ idx, address, list, dispatch, contracts, debts, collateral, toggleModal }) => {
	const { balances }: any = useSelector((state: RootState) => state.balances);
	const [value, setValue] = useState("0");
	const [gas, setGas] = useState("0");
	const maxBalance = balances.pUSD.transferable;
	let debt = debts === "0" ? "200.0123" : debts; // ! temp test code

	let profit;

	console.log("debt", debt, debt.toString());

	const modalRef = useRef<any>();
	const closeModalHandler = (e) => {
		if (list[idx].toggle && !modalRef.current.contains(e.target)) toggleModal(idx);
	};

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
						<span>{`Gas: ${gas}`}</span>
					</SubIndicator>
					<img src={`/images/currencies/pUSD.png`} alt="pUSD" />
					<TakeInput
						type="number"
						placeholder="0"
						min="0"
						// max={debt.toString()}
						max={"200"} // ! temp testing value
						step="0.01"
						value={value === "0" ? "" : value}
						autoFocus={true}
						onChange={(e) => setValue(e.target.value)}
					/>
					<MaxBtn onClick={() => setValue(false ? debt.toString() : "200")}>max</MaxBtn>
				</InputBox>

				<TakeSlider
					type="range"
					min="0"
					// max={debt.toString()}
					max="200"
					step="0.01"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<TakePercentage>
					<span onClick={() => setValue("0")}>0%</span>
					<span onClick={() => setValue(String(debt * 0.25))}>25%</span>
					<span onClick={() => setValue(String(debt * 0.5))}>50%</span>
					<span onClick={() => setValue(String(debt * 0.75))}>75%</span>
					<span onClick={() => setValue(debt.toString())}>100%</span>
				</TakePercentage>

				<ContentSection>
					<div style={{ display: "flex" }}>
						<ContentBox>
							<span className="title">{`Debt ( $ ${debt.toString()} )`}</span>
							<span className="content">
								<span>
									<img className="icon" src={`/images/currencies/pUSD.png`} alt="pUSD" />
									{debt.toString()}
								</span>
							</span>
						</ContentBox>
						<ContentBox>
							<span className="title">{`Profit`}</span>
							<span className="content">
								<span>{`130 USD`}</span>
							</span>
						</ContentBox>
					</div>
					<ContentBox>
						<span className="title">{`Collateral ( $ )`}</span>
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

				<SubmitBtn onClick={() => getTake(value, idx, address, list, dispatch, contracts, balances)}>TAKE</SubmitBtn>
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

const Area = styled.form`
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
	margin-right: 5rem;
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
