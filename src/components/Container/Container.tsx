import styled from 'styled-components';

export const BodyContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	padding: 20px 50px;
	height: 100vh;
	background-color: ${props => props.theme.colors.backgroundColor.body};
`;

export const MainContainer =  styled.div`
	margin-top: 30px;
	width: 100%;
	border-radius: 25px;
    background-color: ${props => props.theme.colors.backgroundColor.panel};
`;

export const RoundContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${props => props.theme.colors.font.secondary};
	background-color: ${props => props.theme.colors.backgroundColor.panel};
	border-radius: 25px;
	height: 50px;
	margin: 0px 10px;
`;

export const BlueBorderRoundContainer = styled(RoundContainer)`
	flex: 1;
	flex-direction: column;
	width: 100%;
	height: 100%;
	border: 1px solid ${props => props.theme.colors.border};
	padding: 20px 10px;
	background-color: transparent;
`

export const HeaderContainer = styled.div`
	display: flex;
	flex: 2 1 3;
	flex-direction: row;
	justify-content: space-between;
`

export const FooterTitleContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const FooterRoundContainer = styled(RoundContainer)`
	//margin delete
    align-items: baseline;
    justify-content: left;
    padding: 20px;
    flex: 1;
	display: flex;
	flex-direction: column;
    height: 100%;
	max-height: 330px;
`

export const TableContainer = styled.div`
	width: 100%;
	margin-top: 30px;
`