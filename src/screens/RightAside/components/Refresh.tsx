import { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from "react-redux"
import { RootState } from 'config/reducers'

import { getVestable } from 'lib/vest'
import { getBalances } from 'lib/balance'
import { getRatios } from 'lib/rates'
import { getNetworkFee } from 'lib/fee'

import { initCurrecy } from 'config/reducers/wallet'
import { updateRatio } from 'config/reducers/rates'
import { updateExchangeRates } from 'config/reducers/rates'
import { updateVestable } from 'config/reducers/vest'
import { updateNetworkFee } from 'config/reducers/networkFee'


const Refresh = () => {
    const dispatch = useDispatch();
    const { address, networkId } = useSelector((state: RootState) => state.wallet);
    const { balances } = useSelector((state: RootState) => state.balances);
    const themeState = useSelector((state: RootState) => state.theme.theme);
    const [ isLoading, setIsLoading ] = useState(false);
    
    const getSystemData = async () => {
        setIsLoading(true);
        const ratios = await getRatios(address);
        dispatch(updateRatio(ratios.ratio));
        dispatch(updateExchangeRates(ratios.exchangeRates));
        
        const balancesData = await getBalances(address, balances, ratios.exchangeRates, ratios.ratio.targetCRatio, ratios.ratio.currentCRatio);
        dispatch(initCurrecy(balancesData)); 

        const vestable:boolean = await getVestable(address);
        dispatch(updateVestable({vestable}));

        const gasPrice = await getNetworkFee(networkId);
        dispatch(updateNetworkFee({gasPrice}));
        setIsLoading(false);
    }

    return (
        <Container disabled={isLoading} onClick={() => getSystemData()}>
            <img src={`/images/${themeState}/reFresh.svg`} alt="reFresh"></img>
        </Container>
    );
}

const Container = styled.button`
    border-radius: 50px;
    width: 45px;
    height: 45px;
    justify-content: center;
    background-color: ${props => props.theme.colors.background.reFresh};
    border: none;
    img {
        width: 25px;
        height: 25px;
    }
`

export default Refresh;