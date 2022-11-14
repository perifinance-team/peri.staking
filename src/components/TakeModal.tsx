import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { RootState } from "config/reducers";

import { getTake } from "lib/liquidation/getTake";
import { formatCurrency } from "lib/format";
import { utils } from "ethers";

const decimalSplit = (value: string | number) => {
	if (!value) return "0";
	const splitStr = String(value).split(".");
	if (!splitStr[1]) return splitStr[0];

	if (Number(splitStr[0]) > 10) {
		return `${splitStr[0]}.${splitStr[1].slice(0, 2)}`;
	} else if (Number(splitStr[0]) > 0) {
		return `${splitStr[0]}.${splitStr[1].slice(0, 4)}`;
	} else {
		return `${splitStr[0]}.${splitStr[1].slice(0, 8)}`;
	}
};

const TakeModal = ({ idx, address, list, dispatch, contracts, debt, collateral, toggleModal, cRatio }) => {
	const { balances }: any = useSelector((state: RootState) => state.balances);
	const { gasPrice } = useSelector((state: RootState) => state.networkFee);

	const [value, setValue] = useState<any>("0");
	const [gas, setGas] = useState<any>(null);
	const [profit, setProfit] = useState<any>(null);
	const [sumCollateral, setSumCollateral] = useState<any>(null);
	const [collateralList, setCollateralList] = useState({ peri: "0", dai: "0", usdc: "0" });
	const [viewValue, setViewValue] = useState([]);

	const maxBalance = balances.pUSD.transferable;
	const modalRef = useRef<any>();
	const closeModalHandler = (e) => {
		if (list[idx].toggle && !modalRef.current?.contains(e.target)) toggleModal(idx);
	};

	const getProfit = () => {
		setProfit(value ? (Number(value.replaceAll(",", "")) * 1.1 - value - Number(gas)).toFixed(4) : "0");
	};

	const sumCollateralHandler = async () => {
		const collateral = {
			Peri: BigInt((await contracts.ExchangeRates.rateForCurrency(utils.formatBytes32String("PERI"))).toString()),
			USDC: BigInt((await contracts.ExchangeRates.rateForCurrency(utils.formatBytes32String("USDC"))).toString()),
			Dai: BigInt((await contracts.ExchangeRates.rateForCurrency(utils.formatBytes32String("DAI"))).toString()),
		};

		const peri = (BigInt(list[idx].collateral[0].value) * BigInt(collateral.Peri)) / 10n ** 18n;
		const dai = (BigInt(list[idx].collateral[1].value) * BigInt(collateral.Dai)) / 10n ** 18n;
		const usdc = (BigInt(list[idx].collateral[2].value) * BigInt(collateral.USDC)) / 10n ** 18n;

		setCollateralList({
			peri: String(formatCurrency(collateral.Peri)),
			dai: String(formatCurrency(collateral.Dai)),
			usdc: String(formatCurrency(collateral.USDC)),
		});

		setSumCollateral(
			String((Number(debt.replaceAll(",", "")) - Number(formatCurrency(peri + dai + usdc).replaceAll(",", "")) / 1.5) * 1.1)
		);

		getMaxFlagValue(
			String((Number(debt.replaceAll(",", "")) - Number(formatCurrency(peri + dai + usdc).replaceAll(",", "")) / 1.5) * 1.1)
		);
	};

	const getMaxFlagValue = (sumCollateral) => {
		const peri = isNaN(collateral[0].value) ? 0 : Number(sumCollateral) / Number(collateralList.peri);

		const dai =
			peri - collateral[1].value > 0 && Number(collateralList.dai) !== 0 && peri !== 0
				? ((peri - Number(formatCurrency(collateral[1].value).replaceAll(",", ""))) * Number(collateralList.peri)) /
				  Number(collateralList.dai)
				: 0;

		const usdc =
			dai - collateral[2].value > 0 && Number(collateralList.usdc) !== 0 && peri !== 0
				? ((dai - Number(formatCurrency(collateral[2].value).replaceAll(",", ""))) * Number(collateralList.peri)) /
				  Number(collateralList.usdc)
				: 0;

		const tempViewValue = [];
		tempViewValue.push(
			peri > Number(formatCurrency(collateral[0].value).replaceAll(",", ""))
				? Number(formatCurrency(collateral[0].value).replaceAll(",", ""))
				: peri
		);
		tempViewValue.push(
			dai > Number(formatCurrency(collateral[1].value).replaceAll(",", ""))
				? Number(formatCurrency(collateral[1].value).replaceAll(",", ""))
				: dai
		);
		tempViewValue.push(
			usdc > Number(formatCurrency(collateral[2].value).replaceAll(",", ""))
				? Number(formatCurrency(collateral[2].value).replaceAll(",", ""))
				: usdc
		);

		Number(formatCurrency(maxBalance).replaceAll(",", "")) < tempViewValue[0] * 0.08 &&
			(tempViewValue[0] = decimalSplit(Number(formatCurrency(maxBalance).replaceAll(",", "")) / 0.08));

		setViewValue([...tempViewValue]);
	};

	const getGasPrice = async () => {
		try {
			const convertValue = utils.parseEther(value.replaceAll(",", ""));
			const estimateGas = await contracts.signers.PeriFinance.estimateGas.liquidateDelinquentAccount(
				list[idx].address,
				BigInt(convertValue.toString())
			);
			const estimateGasPrice = utils.formatEther((BigInt(estimateGas.toString()) * BigInt(gasPrice)).toString());
			setGas((Number(estimateGasPrice) * 0.1).toFixed(8));
		} catch (e) {
			console.error("getGasPrice ERROR:", e);
		}
	};

	const getMaxAmount = (per = 1) => {
		if (sumCollateral) {
			const trulyMax = Number(sumCollateral.replaceAll(",", "")) / 1.1;
			return Number(formatCurrency(maxBalance).replaceAll(",", "")) > Number(trulyMax)
				? String(Number(trulyMax) * per)
				: String(formatCurrency(maxBalance).replaceAll(",", "") * per);
		}
	};

	const onChangeTakeInput = (value) => {
		const available = Number(formatCurrency(maxBalance).replaceAll(",", ""));
		available >= Number(value) && setValue(value);
	};

	useEffect(() => {
		sumCollateralHandler();
		getGasPrice();
	}, []);

	useEffect(() => {
		getProfit();
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
				<CloseBtn src={`/images/icon/close.svg`} onClick={() => toggleModal(idx)} />
				<InputBox>
					<SubIndicator>
						<span>{`Available: ${formatCurrency(maxBalance)}`}</span>
						{gas ? (
							<span>{`Gas Fee: ${gas}`}</span>
						) : (
							<span style={{ display: "flex" }}>
								<span>Gas Fee:</span>
								<SmallLoadingSpinner />
							</span>
						)}
					</SubIndicator>
					<img src={`/images/currencies/pUSD.png`} alt="pUSD" />
					<TakeInput
						type="number"
						placeholder="0"
						min="0"
						max={getMaxAmount(1)}
						step="0.01"
						value={value === "0" ? "" : value}
						autoFocus={true}
						onChange={(e) => onChangeTakeInput(e.target.value)}
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
							<span className="title">{`Pay off ( $ ${Number(value).toFixed(2)} )`}</span>
							<span className="content">
								<span>
									<img className="icon" src={`/images/currencies/pUSD.png`} alt="pUSD" />
									{Number(value).toFixed(2)}
								</span>
							</span>
						</ContentBox>
						<ContentBox>
							<span className="title">{`Estimate Profit`}</span>
							<span className="content">
								{profit ? (
									<span>{`${value === "0" ? "0" : profit} USD`}</span>
								) : (
									<span style={{ display: "flex" }}>
										<SmallLoadingSpinner /> USD
									</span>
								)}
							</span>
						</ContentBox>
					</div>
					<div style={{ display: "flex" }}>
						<ContentBox>
							{sumCollateral ? (
								<span className="title">{`Take away ( $ ${
									Number(formatCurrency(maxBalance).replaceAll(",", "")) < viewValue[0] * 0.08
										? decimalSplit(formatCurrency(maxBalance).replaceAll(",", ""))
										: decimalSplit(viewValue[0] * 0.08)
								} )`}</span>
							) : (
								<span className="title" style={{ display: "flex" }}>
									Take away ( $ <SmallLoadingSpinner /> )
								</span>
							)}

							<span className="content">
								{collateral.map((item, idx) => {
									return (
										<span key={`collateral_${item.name}`}>
											<img
												className="icon"
												src={`/images/currencies/${item.name.toUpperCase()}.png`}
												alt={item.name.toUpperCase()}
											/>
											<span>{`${item.name} ${decimalSplit(viewValue[idx])}`}</span>
										</span>
									);
								})}
							</span>
						</ContentBox>
						<ContentBox>
							<span className="title">{`C-Ratio`}</span>
							<span className="content">
								<span style={{ display: "flex" }}>{cRatio}</span>
							</span>
						</ContentBox>
					</div>
				</ContentSection>

				<SubmitBtn onClick={() => getTake(value, idx, address, list, dispatch, contracts, balances, toggleModal)}>TAKE</SubmitBtn>
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

const CloseBtn = styled.img`
	width: 13px;
	position: absolute;
	top: 20px;
	right: 20px;
	cursor: pointer;
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
	position: relative;
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
	margin-right: 2rem;
	margin-bottom: 1.5rem;

	img {
		width: 14px;
		margin-right: 6px;
	}

	.title {
		font-weight: bold;
		margin-bottom: 7px;
		width: fit-content;
		min-width: 190px;
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

const SmallLoadingSpinner = styled.div`
	width: 10px;
	height: 10px;
	border: 2px solid #262a3c;
	border-radius: 50%;
	border-top-color: #4182f0;
	border-left-color: #4182f0;
	border-right-color: #4182f0;
	margin: 0 10px;
	animation: spin 0.8s infinite ease-in-out;

	@keyframes spin {
		to {
			transform: rotate(1turn);
		}
	}
`;

export default TakeModal;
