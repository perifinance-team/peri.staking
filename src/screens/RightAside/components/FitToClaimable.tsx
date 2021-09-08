import styled from 'styled-components';
import { useSelector, useDispatch } from "react-redux"
import { RootState } from 'config/reducers'
import { H3 } from 'components/headding'
import { contracts } from 'lib/contract'
import { updateTransaction } from 'config/reducers/transaction'
import { setLoading } from 'config/reducers/loading'
import { NotificationManager } from 'react-notifications';
import { formatCurrency } from 'lib'

const FitToClaimable = () => {
    const dispatch = useDispatch();
    const { gasPrice } = useSelector((state: RootState) => state.networkFee);
    const { currentCRatio } = useSelector((state: RootState) => state.ratio);
    const { balances } = useSelector((state: RootState) => state.balances);
    const { address } = useSelector((state: RootState) => state.wallet);

    const getGasEstimate = async () => {
        let gasLimit = 600000n;
        dispatch(setLoading({name: 'gasEstimate', value: true}));
        try {
            gasLimit = BigInt((await contracts.signers.PeriFinance.estimateGas.fitToClaimable(
            )).toString());
        } catch(e) {
            console.log(e);
        }
        dispatch(setLoading({name: 'gasEstimate', value: false}));
        return (gasLimit * 12n /10n).toString()
    }

    const fitToClaimable = async () => {
        dispatch(setLoading({name: 'amountsToFitClaimable', value: true}));
        try {
            const ableAmount = BigInt((await contracts.signers.PeriFinance.amountsToFitClaimable(address))[0]);
            dispatch(setLoading({name: 'amountsToFitClaimable', value: false}));
            if(balances['pUSD'].transferable <= ableAmount) {
                NotificationManager.error(`To Fit To Claimable, pUSD must be greater than ${formatCurrency(ableAmount, 2)}`, 'ERROR');
                return false;
            }
        } catch (e) {
            console.log(e)
            dispatch(setLoading({name: 'amountsToFitClaimable', value: false}));
        }
        
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
