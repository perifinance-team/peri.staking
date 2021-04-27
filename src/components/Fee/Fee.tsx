import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from 'config/reducers'
import styled from 'styled-components'
import { updateSelectedFee } from 'config/reducers/networkFee'


import { H6 } from 'components/Text'
import { SkeyBlueButton } from 'components/Button'
import numbro from 'numbro'

const Fee = ({gasPrice, gasLimit}) => {
    const dispatch = useDispatch();
    const { ETH } = useSelector((state: RootState) => state.exchangeRates);
    const networkFee = useSelector((state: RootState) => state.networkFee);
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    const [feeToGwei, setFeeToGwei] = useState<number>(0);
    const [feeToUSD, setFeeToUSD] = useState<number>(0);
    useEffect(() => {
        try {
            dispatch(updateSelectedFee(networkFee.AVERAGE));
            setFeeToGwei(seletedFee.price);
            setFeeToUSD(
                numbro(feeToGwei).multiply(numbro(ETH).value()).value()
            )
        } catch(e) {
            console.log(e);
            setFeeToGwei(0);
        }
        
    }, [gasPrice, gasLimit])
    
    return (
        <FeeContainer>
            <H6>Ethereum network fees : ${feeToUSD} / {feeToGwei} GWEI</H6>
            {/* <EditButton>
                <H6 color={'primary'}>edit</H6>
            </EditButton> */}
        </FeeContainer>
    );
}

const FeeContainer = styled.div`
    margin: 10px;
    display: flex;
    justify-content: center;
    vertical-align: middle;
`

const EditButton = styled(SkeyBlueButton)`
    padding: 0px 10px;
    margin: 0px 10px;
`
export default Fee
