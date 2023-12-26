import styled from "styled-components";

interface Paragraph {
	$weight?: string;
	$color?: string;
	$align?: string;
	$margin?: string;
	$fontSize?: number;
}

const weight = {
	m: 500,
	sb: 600,
	b: 700,
	eb: 800,
};

export const H1 = styled.h1<Paragraph>`
	font-size: 5vw;
	font-weight: 800;
	color: ${(props) => props.theme.colors.font.tertiary};
	opacity: 0.5;
	margin: 5px;
	text-align: ${(props) => (props.$align ? props.$align : "center")};
`;

export const H2 = styled.h2`
	font-size: 1.5rem;
	font-weight: 800;

	color: ${(props) => props.theme.colors.font.primary};

	${({ theme }) => theme.media.tablet`
		font-size: 1.3rem;	
	`}

	${({ theme }) => theme.media.mobile`
		font-size: 1.1rem;	
	`}
`;

export const H3 = styled.h3<Paragraph>`
	font-size: 1.125rem;
	font-weight: ${(props) => (props.$weight ? weight[props.$weight] : 800)};
	margin: ${(props) => (props.$margin ? props.$margin : '0px')};
	text-align: ${(props) => (props.$align ? props.$align : "center")};
	color: ${(props) => (props.$color ? props.theme.colors.font[props.$color] : props.theme.colors.font.primary)};

	${({ theme }) => theme.media.mobile`
		font-size: 0.9rem;	
	`}
`;

export const H4 = styled.h4<Paragraph>`
	width: 100%;
	font-size: 0.9rem;
	font-weight: ${(props) => (props.$weight ? weight[props.$weight] : 500)};
	margin: ${(props) => (props.$margin ? props.$margin : '0px')};
	text-align: ${(props) => (props.$align ? props.$align : "center")};
	color: ${(props) => (props.$color ? props.theme.colors.font[props.$color] : props.theme.colors.font.primary)};
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;

	${({ theme }) => theme.media.tablet`
		font-size: 0.8rem;	
	`}

	${({ theme }) => theme.media.mobile`
		font-size: 0.7rem;	
	`}
`;

export const H5 = styled.h5<Paragraph>`
	width: 100%;
	font-size: 0.625rem;
	font-weight: ${(props) => (props.$weight ? weight[props.$weight] : 500)};
	$margin: ${(props) => (props.$margin ? props.$margin : '0px')};
	text-align: ${(props) => (props.$align ? props.$align : "center")};
	color: ${(props) => (props.$color ? props.theme.colors.font[props.$color] : props.theme.colors.font.primary)};
`;


export const SmallLoadingSpinner = styled.div`
	width: 10px;
	height: 10px;
	border: 2px solid #262a3c;
	border-radius: 50%;
	border-top-color: #4182f0;
	border-left-color: #4182f0;
	border-right-color: #4182f0;
	margin: 0 10px;
	animation: spin 0.8s infinite ease-in-out;

	@keyframes spin {
		to {
			transform: rotate(1turn);
		}
	}
`;