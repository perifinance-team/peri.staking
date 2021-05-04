import styled from 'styled-components';
import { BlueBorderRoundContainer } from 'components/Container'
import { H1, H3} from 'components/Text'

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
	display: grid;
	grid-template-columns: repeat(3, 230px);
	grid-template-rows: repeat(2, 220px);
	grid-gap: 20px;
`;

export const ActionButtonContainer = styled(BlueBorderRoundContainer)`
	margin: 0;
	padding: 20px 10px;
	cursor: pointer;
	justify-content: start;
	&:hover {
		background-color: ${props => props.theme.colors.hover.background};
	}
	H4 {
		margin: 10px;
	}
`;

export const ActionImage = styled.img`
	height: 80px;
	width: 80px;
`;





