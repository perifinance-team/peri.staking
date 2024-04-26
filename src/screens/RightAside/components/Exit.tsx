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
			gasLimit = (await contracts.signers.PeriFinance.estimateGas.exit()).toBigInt();
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
		<Container disabled={currentCRatio <= 0n}onClick={() => exit()}>
			<H4 $weight={"m"}>Burn All</H4>
		</Container>
	);
};

const Container = styled.button`
	padding: 0px 10px;
	height: 30px;
	background-color: ${(props) => props.theme.colors.background.button.fifth};
	border: ${(props) => `1px solid ${props.theme.colors.border.tableRow}`};
	box-shadow: 0.5px 1.5px 0px ${(props) => props.theme.colors.border.primary};
	border-radius: 14px;

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
`;

export default Exit;
