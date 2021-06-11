import styled from 'styled-components';
import { BlueBorderRoundContainer } from 'components/Container'
import { H1, H3} from 'components/Text'

export const Container = styled.div`
    flex: 1;
	padding: 10px 20px;
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
	margin: auto;
	display: grid;
	grid-template-columns: repeat(3, 200px);
	grid-template-rows: repeat(2, 190px);
	grid-gap: 20px;
`;

export const ActionButtonContainer = styled(BlueBorderRoundContainer)<{disabled?: Boolean}>`
	margin: 0;
	padding: 20px 10px;
	cursor: ${props => props.disabled ? 'no-drop' : 'pointer'};
	&:hover {
		background-color: ${props => props.disabled ? '' : props.theme.colors.hover.background};
	}
`;

export const ActionImage = styled.img`
	height: 80px;
	width: 80px;
	margin-bottom: 20px;
`;

export const ActionButtonTitle = styled.div`
	display: flex;
	flex-direction: column;
`