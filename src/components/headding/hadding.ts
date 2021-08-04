import styled from 'styled-components'

interface Paragraph {
    weigth?: string;
    color?: string;
    align?: string;
    margin?: number;
    fontSize?: number;
}

const weigth = {
    m: 500,
    sb: 600,
    b: 700,
    eb: 800
}

export const H1 = styled.h1<Paragraph>`
    font-size: 5vw;
    font-weight: 800;
    color: ${props => props.theme.colors.font.tertiary};
    opacity: 0.5;
    margin: 5px;
    text-align: ${props => props.align ? props.align : 'center'};
`;

export const H2 = styled.h2`
    font-size: 2.4rem;
    font-weight: 800;
    
    color: ${props => props.theme.colors.font.primary};
`

export const H3 = styled.h3<Paragraph>`
    font-size: 1.8rem;
    font-weight: ${props => props.weigth ? weigth[props.weigth] : 800};
    margin: 0px;
    text-align: ${props => props.align ? props.align : 'center'};
    color: ${props => props.color ? props.theme.colors.font[props.color] : props.theme.colors.font.primary};
`

export const H4 = styled.h4<Paragraph>`
    width: 100%;
    font-size: 1.4rem;
    font-weight: ${props => props.weigth ? weigth[props.weigth] : 500};
    margin: 0px;
    text-align: ${props => props.align ? props.align : 'center'};
    color: ${props => props.color ? props.theme.colors.font[props.color] : props.theme.colors.font.primary};
`

export const H5 = styled.h5<Paragraph>`
    width: 100%;
    font-size: 1.0rem;
    font-weight: ${props => props.weigth ? weigth[props.weigth] : 500};
    margin: 0px;
    text-align: ${props => props.align ? props.align : 'center'};
    color: ${props => props.color ? props.theme.colors.font[props.color] : props.theme.colors.font.primary};
`