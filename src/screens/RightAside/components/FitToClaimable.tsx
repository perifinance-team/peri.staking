import styled from 'styled-components';
import { useSelector, useDispatch } from "react-redux"
import { RootState } from 'config/reducers'
import { H3 } from 'components/headding'
import { contracts } from 'lib/contract'
import { updateTransaction } from 'config/reducers/transaction'


const FitToClaimable = () => {
    const dispatch = useDispatch();
    const { gasPrice } = useSelector((state: RootState) => state.networkFee);
    const { currentCRatio } = useSelector((state: RootState) => state.ratio);
    
    const getGasEstimate = async () => {
        let gasLimit = 600000n;
        try {
            gasLimit = BigInt((await contracts.signers.PeriFinance.estimateGas.fitToClaimable(
            )).toString());
        } catch(e) {
            console.log(e);
        }
        return (gasLimit * 12n /10n).toString()
    }

    const fitToClaimable = async () => {
        const transactionSettings = {
            gasPrice: gasPrice.toString(),
            gasLimit: await getGasEstimate(),
        }
        
        try {
            let transaction;
            transaction = await contracts.signers.PeriFinance.fitToClaimable(
                transactionSettings
            );
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `FIT TO CLAIMABLE`,
                    type: 'Burn'
                }
            ));
        } catch(e) {
            console.log(e);
        }
    }
    return (
        <>
        {
            currentCRatio > 250000000000000000n &&
            <FitToClaimableButton onClick={() => fitToClaimable()}>
                <H3>FIT TO CLAIMABLE</H3>
            </FitToClaimableButton>
        }
        </>
        
    );
}
const FitToClaimableButton = styled.button`
    border-radius: 10px;
    border: ${props => `2px solid ${props.theme.colors.border.tertiary}`};
    color: ${props => props.theme.colors.font.primary};
    padding: 1.5rem;
    margin-top: 15px;
    margin-bottom: 20px;
    background-color: transparent;
`


export default FitToClaimable;
