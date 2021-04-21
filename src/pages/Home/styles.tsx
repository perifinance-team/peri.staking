import styled from 'styled-components';
import { MainContainer } from 'components/Container'
import { H1, H3, H4, H6} from 'components/Text'
import { Button } from 'components/Button'


export const Container = styled.div`
    flex: 1;
`

export const IntroContainer = styled.div`
	margin-left: 100px;
`;

export const IntroTitle = styled(H1)`
	width: 200px;
	text-align: left;
	line-height: 70px;
	margin-bottom: 0px;
`;

export const IntroSubTitle = styled(H3)`
	text-align: left;
`;

export const ActionButtonRow = styled.div`
	padding: 30px;
	display: grid;
	grid-template-columns: repeat(3, 200px);
	grid-template-rows: repeat(2, 1fr);
	grid-gap: 20px;
`;

export const ActionButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	overflow: hidden;
`;

export const ActionImage = styled.img`
	height: 80px;
	width: 80px;
`;

export const ActionButton = styled.button`
	padding: 30px;
	flex: 1;
	cursor: pointer;
	border: 2px solid ${props => props.theme.colors.border};
	border-radius: 25px;
	background-color: transparent;
	&:hover {
		background-color: ${props => props.theme.colors.hover.background};
	}
`;





