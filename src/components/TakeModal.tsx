import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { RootState } from "config/reducers";
import { SmallLoadingSpinner } from "./heading";
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
	const modalRef = useRef<HTMLDivElement>(null);
	const closeModalHandler = (e) => {
		console.log("e.target", e.target);
		if (e.target.id === "close_caller" && list[idx].toggle && !modalRef.current?.contains(e.target)) {
			console.log("closeModalHandler");
			toggleModal(idx);
		}
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
				<CloseBtn id="close_caller" src={`/images/icon/close.svg`} onClick={() => toggleModal(idx)} />
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
					<ContentBoxContainer>
						<ContentBox>
							<span className="title">{`C-Ratio`}</span>
							<span className="content">
								<span style={{ display: "flex" }}>{cRatio}</span>
							</span>
						</ContentBox>
						<ContentBox>
							<span className="title">{`Pay off`/*  ( $ ${Number(value).toFixed(2)} )` */}</span>
							<span className="content">
								<span>
									<img className="icon" src={`/images/currencies/pUSD.png`} alt="pUSD" />
									{Number(value).toFixed(2)}
								</span>
							</span>
						</ContentBox>
					</ContentBoxContainer>
					<ContentBoxContainer>
						<ContentBox>
							<span className="title">{`Estimate Profit`}</span>
							<span className="content">
								{profit ? (
									<span>{`$${value === "0" ? "0" : profit}`}</span>
								) : (
									<span style={{ display: "flex" }}>
										$<SmallLoadingSpinner />
									</span>
								)}
							</span>
						</ContentBox>
						<ContentBox>
							{sumCollateral ? (
								<span className="title">{`Take away`/*  ( $ ${
									Number(formatCurrency(maxBalance).replaceAll(",", "")) < viewValue[0] * 0.08
										? decimalSplit(formatCurrency(maxBalance).replaceAll(",", ""))
										: decimalSplit(viewValue[0] * 0.08)
								} )` */}</span>
							) : (
								<span className="title" style={{ display: "flex" }}>
									Take away ( $ <SmallLoadingSpinner /> )
								</span>
							)}

							<span className="content">
								{collateral.map((item, idx) => {
									return (
										viewValue[idx] > 0 && <span key={`collateral_${item.name}`}>
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
						
					</ContentBoxContainer>
				</ContentSection>

				<SubmitBtn id="close_caller" onClick={() => getTake(value, idx, address, list, dispatch, contracts, balances, toggleModal)}>Take</SubmitBtn>
			</Area>
		</TakeModalItem>
	);
};

const TakeModalItem = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
	// flex-direction: column;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	right: 0;
	z-index: 2;
	background: transparent;
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
	min-width: 400;
	min-height: 420;
	padding: 10px 10px 30px 10px;
	border-radius: 20px;
	background: ${({theme}) => theme.colors.background.body};
	border: ${({theme}) => `1px solid ${theme.colors.border.primary}`};
  	box-shadow: ${({theme}) => `0px 0px 10px ${theme.colors.border.primary}`};
	color: #fefffe;
	font-weight: bold;
	position: relative;
`;

const TakeSlider = styled.input`
	width: 16.4rem;
	height: fit-content;
	// padding-left: 1px;
`;

const TakePercentage = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 16rem;
	font-size: 0.6875rem;

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
	width: 16rem;
	height: 1.5rem;
	padding: 3px 0 3px 3px;
	border-radius: 35px;
	background: #0e101e;
	position: relative;
	margin-top: 50px;
	margin-bottom: 5px;

	img {
		width: 20px;
	}
`;

const SubIndicator = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	position: absolute;
	top: -18px;

	span {
		font-size: 0.6rem;
		margin: 0 10px;
	}
`;

const TakeInput = styled.input`
	width: 12rem;
	height: fit-content;
	background: #525252;
	outline: none;
	border: none;
	color: #fefffe;
	text-align: right;
	font-size: 0.9em;
	font-weight: bold;
	background: #0e101e;

	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

const ContentSection = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	width: fit-content;

	// ${({ theme }) => theme.media.mobile`
	// 	justify-content: center;
	// 	flex-direction: row;
	// 	align-items: center;
	// `}
`;

const ContentBoxContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;

	${({ theme }) => theme.media.mobile`
		// justify-content: center;
		flex-direction: column;
		align-items: flex-end;
		margin: 10px 0px;

	`}
`;

const ContentBox = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 0.8125rem;
	margin: 20px 5px 0 5px;
	// margin-bottom: 1.5rem;

	img {
		width: 14px;
		margin-right: 6px;
	}

	.title {
		font-weight: bold;
		vertical-align: middle;
		width: fit-content;
		min-width: 190px;
		text-align: center;
		margin-top: 10px;
		margin-bottom: 5px;
	}

	.content {
		display: flex;
		justify-content: center;
		flex-direction: column;

		span {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	${({ theme }) => theme.media.mobile`
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 10px 5px 0 5px;
		width: 100%;

		.title {
			display: inline-block;
			vertical-align: middle;
			text-align: right;
			min-width: 80px;
			max-width: 110px;
			width: 50%;
			margin: 0;
		}
		.content {
			flex-direction: row;
			justify-content: flex-end;
			width: 50%;
			min-width: 140px;

			span {
				margin-bottom: 0;
			}
		}
	`}
`;

const SubmitBtn = styled.button`
	width: 16rem;
	height: 35px;
	font-weight: bold;
	border-radius: 25px;
	margin-top: 30px;
	color: white;
	font-size: 0.9rem;
	background: ${({theme}) => theme.colors.background.body};
	border: ${({theme}) => `1.5px solid ${theme.colors.border.tableRow}`};
	box-shadow: ${({theme}) => `0.5px 1.5px 0px ${theme.colors.border.primary}`};

	&:hover {
		transition: 0.2s ease-in-out;
		transform: translateY(-1px);
		box-shadow: ${({theme}) => `0.5px 3px 0px ${theme.colors.border.primary}`};
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
		padding: 0.5rem 0;
		font-size: 0.7rem; 
	`}
`;

const MaxBtn = styled(SubmitBtn)`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 1.7rem;
	border-radius: 6px;
	margin-right: -4px;
	font-size: 0.75rem;
	margin-top: 0;

`;

export default TakeModal;
