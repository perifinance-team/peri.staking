import styled from 'styled-components'
import Network from './components/Network';
import Connect from './components/Connect'
// import Translation from './components/Translation';
// import Themes from './components/Themes'

const Header = () => {
    return (
        <Container>
            <Connect/>
            <RightContainer>
                {/* todo:: 연결없을때 숨김처리 */}
                <Network/>
                {/* <Themes/> */}
            </RightContainer>
            {/* <Translation/> */}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 30px 80px 20px 30px ;
`;

const RightContainer = styled.div`
    display: flex;
    flex-direction: row;
`

export default Header;