import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "config/reducers";
import { H4 } from "components/heading";
import { contracts } from "lib/contract";
import { updateTransaction } from "config/reducers/transaction";
import { setLoading } from "config/reducers/loading";
import { NotificationManager } from "react-notifications";
import { formatCurrency } from "lib";

const FitToClaimable = () => {
  const dispatch = useDispatch();
  const { gasPrice } = useSelector((state: RootState) => state.networkFee);
  const { currentCRatio } = useSelector((state: RootState) => state.ratio);
  const { balances } = useSelector((state: RootState) => state.balances);
  const { address } = useSelector((state: RootState) => state.wallet);

  const getGasEstimate = async () => {
    let gasLimit = 600000n;
    dispatch(setLoading({ name: "gasEstimate", value: true }));
    try {
      gasLimit = BigInt(
        (
          await contracts.signers.PeriFinance.estimateGas.fitToClaimable()
        ).toString()
      );
    } catch (e) {
      console.log(e);
    }
    dispatch(setLoading({ name: "gasEstimate", value: false }));
    return ((gasLimit * 12n) / 10n).toString();
  };

  const fitToClaimable = async () => {
    if (contracts.signers.PeriFinance.amountsToFitClaimable) {
      dispatch(setLoading({ name: "amountsToFitClaimable", value: true }));
      try {
        const ableAmount = BigInt(
          (
            await contracts.signers.PeriFinance.amountsToFitClaimable(address)
          )[0]
        );
        dispatch(setLoading({ name: "amountsToFitClaimable", value: false }));
        if (
          (balances["pUSD"].transferable / 10n) * 10n <=
          (ableAmount / 10n) * 10n
        ) {
          NotificationManager.error(
            `To Fit To Claimable, pUSD must be greater than ${formatCurrency(
              ableAmount,
              2
            )}`,
            "ERROR"
          );
          return false;
        }
      } catch (e) {
        console.log(e);
        dispatch(setLoading({ name: "amountsToFitClaimable", value: false }));
      }
    }

    const transactionSettings = {
      gasPrice: gasPrice.toString(),
      gasLimit: await getGasEstimate(),
    };

    try {
      let transaction;
      transaction = await contracts.signers.PeriFinance.fitToClaimable(
        transactionSettings
      );
      dispatch(
        updateTransaction({
          hash: transaction.hash,
          message: `FIT TO CLAIMABLE`,
          type: "Burn",
        })
      );
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <FitToClaimableButton disabled={currentCRatio <= 250000000000000000n}onClick={() => fitToClaimable()}>
      <H4 $weight="m">Fit To Claimable</H4>
    </FitToClaimableButton>
  );
};
const FitToClaimableButton = styled.button`
  width: 100%;
  border-radius: 25px;
  padding: 0.7rem;
  margin-top: 15px;
  margin-bottom: 15px;
  color: ${(props) => props.theme.colors.font.primary};
  background-color: ${(props) => props.theme.colors.background.button.fifth};
  border: ${(props) => `1px solid ${props.theme.colors.border.tableRow}`};
	box-shadow: 0.5px 1.5px 0px ${(props) => props.theme.colors.border.primary};

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

export default FitToClaimable;
