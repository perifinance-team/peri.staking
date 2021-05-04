import styled from 'styled-components';

const ButtonStyle = styled.button`
	border-radius: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: none;
	cursor: pointer;
	transition: all 0.1s ease;
	color: ${props => props.theme.colors.font.secondary};
	:focus {
        outline: none;
    }
`;

export const LightBlueButton = styled(ButtonStyle)`
	background-color: ${props => props.theme.colors.button.primary};
`;

export const BlueGreenButton = styled(ButtonStyle)`
	background-color: ${props => props.theme.colors.button.secondary};
	:disabled {
		background: #ccc;
	}
	:hover {
		background-color: ${props => props.disabled ? 'none' : props.theme.colors.hover.button};
	}
`

export const SkeyBlueButton = styled(LightBlueButton)`
	border: 1px solid  ${props => props.theme.colors.border};
`