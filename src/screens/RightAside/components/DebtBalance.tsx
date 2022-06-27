import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { H3, H4 } from "components/heading";
import { formatCurrency } from "lib";
import Timer from "components/Timer";

const DebtBalance = () => {
	const { balances } = useSelector((state: RootState) => state.balances);
	const { liquidation } = useSelector((state: RootState) => state.liquidation);

	const { currentCRatio } = useSelector((state: RootState) => state.ratio);

	const ratioToPer = (value) => {
		if (value === 0n) return "0";
		return ((BigInt(Math.pow(10, 18).toString()) * 100n) / value).toString();
	};

	const flag = Number(ratioToPer(currentCRatio)) <= 150 && liquidation;

	return (
		<DebtBalanceContainer>
			{flag && <Timer />}
			<H3 align={"left"}>DEBT</H3>
			<BalanceContainer>
				<img alt={"pUSD"} src={`/images/currencies/pUSD.png`}></img>

				<H4 align={"right"}>
					$
					{formatCurrency(
						balances["DEBT"]?.balance ? balances["DEBT"]?.balance : 0n
					)}
				</H4>
			</BalanceContainer>
		</DebtBalanceContainer>
	);
};
const DebtBalanceContainer = styled.div`
	width: 100%;
`;

const BalanceContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 10px 0px;
	margin: 10px 0px;
	border-bottom: 1px solid white;
	img {
		width: 20px;
		height: 20px;
	}
`;

export default DebtBalance;
