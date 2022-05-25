import { useSelector } from "react-redux";
import { RootState } from 'config/reducers'
import styled from 'styled-components'
import { H5 } from 'components/heading'

export const Fee = () => {
    const { gasPrice } = useSelector((state: RootState) => state.networkFee);
    
    return (
        <FeeContainer>
            <H5 color={'primary'}>network fees : {(gasPrice / 1000000000n).toString() } GWEI</H5>
        </FeeContainer>
    );
}

const FeeContainer = styled.div`
    margin-top: 5px;
    display: flex;
    justify-content: center;
    vertical-align: middle;
`
