import styled from 'styled-components';
import { useSelector, useDispatch } from "react-redux"
import { RootState } from 'config/reducers'
import { H4 } from 'components/headding'
import { contracts } from 'lib/contract'
import { updateTransaction } from 'config/reducers/transaction'

const Exit = () => {
    const dispatch = useDispatch();
    const { gasPrice } = useSelector((state: RootState) => state.networkFee);
    const { currentCRatio } = useSelector((state: RootState) => state.ratio);

    const getGasEstimate = async () => {
        let gasLimit = 600000n;
        try {
            gasLimit = BigInt((await contracts.signers.PeriFinance.estimateGas.exit(
                
            )).toString());
        } catch(e) {
            console.log(e);
        }
        return (gasLimit * 12n /10n).toString()
    }

    const exit = async () => {
        const transactionSettings = {
            gasPrice: gasPrice.toString(),
            gasLimit: await getGasEstimate(),
        }
        
        try {
            let transaction;
            transaction = await contracts.signers.PeriFinance.exit(
                transactionSettings
            );
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `EXIT`,
                    type: 'Burn'
                }
            ));
        } catch(e) {
            console.log(e);
        }
    }
    return (
        <>
        {currentCRatio > 0n && <Container onClick={() => exit()}>
            <H4 weigth={'b'}>UNSTAKE ALL</H4>
        </Container>}
        
        </>
    );
}

const Container = styled.button`
    border: none;
    padding: 0px 10px;
    height: 30px;
    background-color: ${props => props.theme.colors.background.reFresh};
`

export default Exit;