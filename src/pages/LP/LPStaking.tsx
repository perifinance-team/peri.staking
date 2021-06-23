import styled from 'styled-components'
import { useEffect, useState, useCallback} from 'react';
import { useSelector, useDispatch } from "react-redux";

import {
    useHistory
} from "react-router-dom";

import Fee from 'components/Fee'
import Input from 'components/Input'
import { H4 } from 'components/Text'
import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'
import { ActionContainer } from 'components/Container'
import { BlueGreenButton } from 'components/Button'
import {pynthetix} from 'lib'

const LPStaking = () => {
    const history = useHistory()
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    console.log(pynthetix)
    return (
        <ActionContainer>
            <div>
                <Input key="PERI/ETH LP"
                    value={1123}
                    currencyName="PERI_ETH"
                    isLp={true}
                    maxAmount={10123}
                />
                <StakingButton onClick={ () => console.log(123)}>
                    <H4 weigth="bold"> STAKE </H4>
                </StakingButton>
                
            </div>
            <Fee gasPrice={seletedFee.price}/>
        </ActionContainer>
    );
}

const StakingButton = styled(BlueGreenButton)`
    width: 100%;
    height: 50px;
`

export default LPStaking;