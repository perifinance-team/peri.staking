import styled from 'styled-components';

import WalletDetail from './components/WalletDetail'
import StakeStatus from './components/StakeStatus'
import TotalBalance from './components/TotalBalance'

const Footer = () => {
    
    return (
        
        <FooterContainer>
            <WalletDetail/>
            {/* <StakeStatus/> */}
            <TotalBalance/>
        </FooterContainer>
    );
}

export const FooterContainer = styled.div`
    flex: 3;
    display: flex;
	justify-content: center;
	align-items: center;
`;

export default Footer;