import styled from 'styled-components';

import { useSelector } from "react-redux";
import { RootState } from 'config/reducers'

import { RoundContainer } from 'components/Container'
import { H6 } from 'components/Text';

const Network = () => {
    const { networkName } = useSelector((state: RootState) => state.wallet);
    return (
        networkName &&
        <RoundContainer>
            <NetworkText>{networkName.toLocaleUpperCase()}</NetworkText>
        </RoundContainer>
    );
}

const NetworkText = styled(H6)`
    margin: 20px;
`

export default Network;