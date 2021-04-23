import styled from 'styled-components';

import WalletDetail from './components/WalletDetail'
import TotalBalance from './components/TotalBalance'
import PeriBalance from './components/PeriBalance'

const Footer = () => {
    
    return (
        
        <FooterContainer>
            <WalletDetail/>
            <TotalBalance/>
            <PeriBalance/>
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