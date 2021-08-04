import styled from 'styled-components';

import Logo from './components/Logo'
import Navigator from './components/Navigator'

const LeftAside = () => {
    return (
        <Aside>
            <Logo></Logo>
            <Navigator></Navigator>
        </Aside>
    );
}
const Aside = styled.aside`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 240px;
    min-width: 240px;
    background-color: ${props => props.theme.colors.background.aside};
    align-items: center;
    padding: 30px 0px;
`
export default LeftAside;
