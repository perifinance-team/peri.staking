import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";
import { H4 } from "components/heading";
import { contracts } from "lib/contract";
import { updateTransaction } from "config/reducers/transaction";
import { NotificationManager } from "react-notifications";
import { setLoading } from "config/reducers/loading";

const Exit = () => {
	const dispatch = useDispatch();
	const { gasPrice } = useSelector((state: RootState) => state.networkFee);
	const { balances } = useSelector((state: RootState) => state.balances);
	const { currentCRatio } = useSelector((state: RootState) => state.ratio);

	const getGasEstimate = async () => {
		let gasLimit = 600000n;
		dispatch(setLoading({ name: "gasEstimate", value: true }));
		try {
			gasLimit = BigInt((await contracts.signers.PeriFinance.estimateGas.exit()).toString());
		} catch (e) {
			console.log(e);
		}
		dispatch(setLoading({ name: "gasEstimate", value: false }));
		return ((gasLimit * 12n) / 10n).toString();
	};

	const exit = async () => {
		if ((balances["DEBT"].balance / 10n) * 10n > (balances["pUSD"].transferable / 10n) * 10n) {
			NotificationManager.error("To unstake all, pUSD must be greater than DEBT", "ERROR", 5000);
			return false;
		}

		const transactionSettings = {
			gasPrice: gasPrice.toString(),
			gasLimit: await getGasEstimate(),
		};

		try {
			let transaction;
			transaction = await contracts.signers.PeriFinance.exit(transactionSettings);
			dispatch(
				updateTransaction({
					hash: transaction.hash,
					message: `EXIT`,
					type: "Burn",
				})
			);
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<>
			{currentCRatio > 0n && (
				<Container onClick={() => exit()}>
					<H4 $weight={"b"}>UNSTAKE ALL</H4>
				</Container>
			)}
		</>
	);
};

const Container = styled.button`
	border: none;
	padding: 0px 10px;
	height: 30px;
	background-color: ${(props) => props.theme.colors.background.reFresh};
	background: #4182f0;
	border-radius: 14px;
`;

export default Exit;
