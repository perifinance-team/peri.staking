import styled from 'styled-components';

import { 
    HashRouter as Router,
    useHistory,
    useLocation,
} from "react-router-dom";

const Navigation = () => {
    const history = useHistory();
    const location = useLocation();
    const isActive = (to) => {
        const homePaths = [
            'staking',
            'burn',
            'claim',
            'trade',
            'transfer',
            'track'
        ]
        const currentPath = location.pathname.split('/')[1].trim();
        
        if(currentPath === to) {
            return true;
        } else {
            if(homePaths.includes(currentPath) && to === '') {
                return true;
            }
            return false;
        }
    }
    const navs = [
        // {
        //     name: 'LP',
        //     to: 'lp'
        // },
        // {
        //     name: 'HOME',
        //     to: '',
        // }
    ]
    
    return (
        <Router>
            <LinkContainer>
                {navs.map((nav) => (
                    <LinkButton key={nav.name} onClick={() => history.push(`/${nav.to}`)} active={isActive(nav.to)}><p>{nav.name}</p></LinkButton>
                ))}
                
                {/* <LinkButton to="/escrow" exact><p>ESCROW</p></LinkButton> */}
                {/* <LinkButton to="/depot" exact><p>ABOUT</p></LinkButton> */}
                
                {/* <LinkButton to="/lp" exact><p>LP</p></LinkButton> */}
            </LinkContainer>
        </Router>
    );
}


const LinkContainer = styled.div`
    display: flex;
    flex-direction: row-reverse;
    flex: 1;
`
const LinkButton = styled.a<{active?: boolean}>`
    height: 50px;
    /* width: 100%; */
    cursor: pointer;
    width: 250px;
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

    ${
        props => {
            return props.active ? {
                color: props.theme.colors.font.primary,
                border: `1px solid ${props.theme.colors.border}`,
                'background-color': props.theme.colors.hover.background,
            } : {}
        }
    }

    p {
        margin: 0px;
        font-size: 20px;
    }
`;



export default Navigation;