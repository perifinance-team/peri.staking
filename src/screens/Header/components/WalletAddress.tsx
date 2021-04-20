import styled from 'styled-components';

import { useSelector } from "react-redux";
import { RootState } from 'config/reducers'

import { RoundContainer } from 'components/Container'
import { shortenAddress } from 'helpers/wallet'

import { H5 } from 'components/Text';

const WalletAddress = () => {
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    return (
        <RoundContainer>
            <WalletImage src="/images/dark/wallet.svg"></WalletImage>
            <CurrentWallet>
               {shortenAddress(currentWallet.toLocaleUpperCase())}
            </CurrentWallet>
        </RoundContainer>
    );
}

const WalletImage = styled.img`
    margin-left: 20px;
`;
const CurrentWallet = styled(H5)`
    margin: 0px 20px 0px 10px;
`;

export default WalletAddress;