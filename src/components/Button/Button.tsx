import styled from 'styled-components';

export const Button = styled.button`
    border-radius: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${props => props.theme.colors.button};
    border: none;
	cursor: pointer;
	transition: all 0.1s ease;
	:hover {
		background-color: ${props => props.theme.colors.hover.button};
	}
`;
