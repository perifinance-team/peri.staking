import styled from 'styled-components';

import Logo from './components/Logo';
import Navigation from './components/Navigation';
import WalletAddress from './components/WalletAddress'
import Network from './components/Network';
import Translation from './components/Translation';

import { HeaderContainer } from 'components/Container'

const Header = () => {
    return (
        <MainHeaderContainer>
            <Logo/>
            <Network/>
            <WalletAddress/>
            <Translation/>
            <Navigation/>
            {/* css작업하기 */}
        </MainHeaderContainer>
    );
}

const MainHeaderContainer = styled(HeaderContainer)`
    justify-content: space-between;
`

export default Header;