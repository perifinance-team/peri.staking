import React from "react";
import styled, { css } from "styled-components";
import { H3, H4 } from "components/heading";
import { RoundButton } from "components/button/RoundButton";
import { Input } from "../../components/Input/index";
import { MaxButton } from "components/button/MaxButton";
import { FeeAndPrice } from "components/Fee";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { formatCurrency } from "lib";

export const BurnCard = ({
	isActive,
	currencyName,
	burnAmount,
	unStakeAmount,
	burnAction,
	isLP = false,
	cRatio = 0n,
	maxAction,
	onChange,
}) => {
	const { isConnect, networkId } = useSelector(
		(state: RootState) => state.wallet
	);
	const { balances } = useSelector((state: RootState) => state.balances);
	const swapName = {
		1: "UNI",
		3: "UNI",
		4: "UNI",
		5: "UNI",
		42: "UNI",
		56: "PANCAKE",
		97: "PANCAKE",
		137: "QUICK",
		80001: "QUICK",
	};
	return (
		<Card isActive={isActive}>
			<IconContainer>
				{isActive && (
					<img
						src={`/images/icon/${
							isLP
								? `${currencyName}_${swapName[networkId]}.png`
								: `${currencyName}.svg`
						}`}
						alt="burn"
					></img>
				)}
				<H3 weight={"sb"}>
					{isLP ? `${swapName[networkId]}SWAP` : currencyName}
				</H3>
				<H4 weight={"b"}>
					Staked: {formatCurrency(balances[currencyName]?.staked, 2)}
				</H4>
			</IconContainer>
			<InputContainer>
				{!isLP && (
					<RowContainer margin={"0px"}>
						{isActive && (
							<Ratio align={"right"} weight={"sb"}>
								EST C-RATIO: {cRatio.toString()}%
							</Ratio>
						)}
					</RowContainer>
				)}
				{!isLP && (
					<RowContainer>
						<Label>{"pUSD"}</Label>
						<Input
							disabled={!isActive}
							currencyName={"pUSD"}
							value={isConnect ? burnAmount : ""}
							onChange={(e) => onChange(e.target.value, currencyName)}
							color={"primary"}
						/>
						<MaxButton
							disabled={!isActive}
							color={"fourth"}
							fontColor={"fifth"}
							onClick={() => maxAction()}
						/>
					</RowContainer>
				)}

				<RowContainer>
					<Label>{currencyName}</Label>
					<Input
						disabled={!isLP || !isActive}
						isLP={isLP}
						currencyName={
							isLP ? `${currencyName}_${swapName[networkId]}` : currencyName
						}
						value={isActive ? unStakeAmount : ""}
						onChange={(e) => onChange(e.target.value, currencyName)}
						color={"primary"}
					/>
					{isLP && (
						<MaxButton
							color={"fourth"}
							fontColor={"fifth"}
							onClick={() => maxAction()}
							disabled={!isActive}
						/>
					)}
				</RowContainer>
				<ColContainer>
					{!isLP ? (
						<RoundButton
							height={30}
							disabled={!isActive}
							onClick={() => burnAction()}
							padding={0}
							color={"fourth"}
							width={320}
							border={"none"}
							margin={"0px 20px 0px 0px"}
						>
							<H4 weight={"sb"} color={"fifth"}>
								BURN
							</H4>
						</RoundButton>
					) : (
						<RoundButton
							height={30}
							disabled={!isActive}
							onClick={() => burnAction()}
							padding={0}
							color={"fourth"}
							width={320}
							border={"none"}
							margin={"0px 20px 0px 0px"}
						>
							<H4 weight={"sb"} color={"fifth"}>
								UNSTAKE
							</H4>
						</RoundButton>
					)}
					{isActive && <FeeAndPrice currencyName={currencyName}></FeeAndPrice>}
				</ColContainer>
			</InputContainer>
		</Card>
	);
};
const Ratio = styled(H4)`
	margin-right: 80px;
`;

const IsActive = css`
	min-width: 700px;
	max-width: 850px;
	width: 100%;
	z-index: 2;
	box-shadow: ${(props) =>
		`0px 0px 25px ${props.theme.colors.border.tertiary}`};
	border: ${(props) => `2px solid ${props.theme.colors.border.tertiary}`};
`;

const Card = styled.div<{ isActive: any }>`
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 100%;
	max-width: 600px;
	min-width: 400px;
	z-index: 1;
	border-radius: 20px;
	background: padding-box;
	background-color: ${(props) => props.theme.colors.background.panel};
	${(props) => (props.isActive ? IsActive : null)}
`;

const IconContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	img {
		width: 70px;
		height: 70px;
	}
	h3 {
		margin: 15px;
	}
`;

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: 2;
	justify-content: center;
`;

const RowContainer = styled.div<{ margin?: string }>`
	width: 460px;
	display: flex;
	margin: ${(props) => (props.margin ? `${props.margin}px` : "10px")};
	flex-direction: row;
	align-items: center;
`;

const ColContainer = styled.div`
	width: 460px;
	display: flex;
	margin: 10px;
	flex-direction: column;
	align-items: center;
`;

const Label = styled(H4)`
	width: 50px;
`;
