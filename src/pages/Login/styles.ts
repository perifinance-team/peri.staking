import styled from 'styled-components';
import { MainContainer } from 'components/Container'
import { H1, H3, H4, H6} from 'components/Text'
import { Button } from 'components/Button'


export const LoginMainContainer = styled(MainContainer)`
    display: flex;
    flex-direction: column;
    justify-content: center;
	padding: 100px 0px;
    height: 100%;
`
export const IntroContainer = styled.div`
	
`;

export const IntroTitle = styled(H1)`
	width: 500px;
	margin: auto;
`;

export const IntroSubTitle = styled(H3)`
`;

export const ButtonContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	max-width: 900px;
    justify-content: center;
	margin: auto;
`;


export const WalletButton = styled(Button)`
	width: 350px;
    height: 60px;
	margin: 10px;
`;

export const WalletText = styled(H4)`
	width: 120px;
`;

export const WalletIcon = styled.img`
	width: 25px;
	height: 25px;
`;

export const LineOrContainer = styled.div`
	display: flex;
	justify-content: center;
`
export const Line = styled.div`
	width: 20%;
	height: 50%;
	border-bottom: 1px solid ${props => props.theme.colors.font.primary};
	
`
export const TextOr = styled(H6)`
	margin: 10px;
`;

export const Link = styled.a`
	margin: auto;
	width: 600px;
	height: 60px;
	border-radius: 50px;
	border: 1px solid ${props => props.theme.colors.font.primary};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	text-decoration: none;
`;

export const LinkText = styled(H4)`
	color: ${props => props.theme.colors.font.primary};
`;