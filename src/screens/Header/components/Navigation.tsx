import styled from 'styled-components';

import { 
    BrowserRouter as Router,
    NavLink
} from "react-router-dom";

const Navigation = () => {
    return (
        <Router>
            <LinkContainer>
                {/* <LinkButton to="/" exact><p>HOME</p></LinkButton> */}
                {/* <LinkButton to="/escrow" exact><p>ESCROW</p></LinkButton>
                <LinkButton to="/depot" exact><p>ABOUT</p></LinkButton>
                <LinkButton to="/transcations" exact><p>TRANSCATIONS</p></LinkButton>
                <LinkButton to="/lp" exact><p>LP</p></LinkButton> */}
            </LinkContainer>
        </Router>
    );
}


const LinkContainer = styled.div`
    display: flex;
    flex: 1;
`
const LinkButton = styled(NavLink)`
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700px;
    border-radius: 50px;
    text-decoration: none;
    color: ${props => props.theme.colors.font.secondary};
    :hover {
        border: 1px solid ${props => props.theme.colors.border};
        color: ${props => props.theme.colors.font.primary};
        background-color: ${props => props.theme.colors.hover.background};
	}
    &.active {
        color: ${props => props.theme.colors.font.primary};
        border: 1px solid ${props => props.theme.colors.border};
        background-color: ${props => props.theme.colors.hover.background};
    }
    p {
        margin: 0px;
        font-size: 20px;
    }
`;



export default Navigation;