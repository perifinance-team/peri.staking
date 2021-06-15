import styled from 'styled-components';
import { BlueBoarderRoundLink } from 'components/Container'
import { H1, H3 } from 'components/Text'

export const Container = styled.div`
	height: 100%;
    flex: 1;
	padding: 20px;
`

export const IntroContainer = styled.div`
	float: right;
	margin-right: 100px;
`;

export const IntroTitle = styled(H1)`
	text-align: right;
	line-height: 70px;
	margin-top: 100px;
	margin-bottom: 0px;
`;

export const IntroSubTitle = styled(H3)`
	width: 600px;
	text-align: right;
`;

export const ActionButtonRow = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 210px);
	grid-template-rows: repeat(2, 200px);
	grid-gap: 15px;
`;

export const ActionButtonContainer = styled(BlueBoarderRoundLink)`
	margin: 0;
	padding: 10px;
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