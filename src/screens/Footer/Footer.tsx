import styled from 'styled-components';

import WalletDetail from './components/WalletDetail'
import PeriBalance from './components/PeriBalance'
import TotalBalance from './components/TotalBalance'

const Footer = () => {
    
    return (
        
        <FooterContainer>
            <WalletDetail/>
            <PeriBalance/>
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