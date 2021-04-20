import styled from 'styled-components';

interface Paragraph {
    weigth?: string;
    color?: string;
}

const weigth = {
    black: 900,
    bold: 700,
    regular: 100,
}

export const H1 = styled.h1`
    font-size: 68px;
    font-weight: ${weigth['black']};
    text-align: center;
    color: ${props => props.theme.colors.font.primary};
`;

export const H2 = styled.h2`
    font-size: 36px;
    font-weight: ${weigth['regular']};
    text-align: center;
    color: ${props => props.theme.colors.font.secondary};
`;

export const H3 = styled.h3<Paragraph>`
    font-size: 32px;
    text-align: center;
    font-weight: ${props => weigth[props.weigth || weigth.regular]};
    color: ${props => props.theme.colors.font.secondary};
`;

export const H4 = styled.h4<Paragraph>`
    margin: 0px;
    font-size: 20px;
    text-align: center;
    font-weight: ${props => weigth[props.weigth || weigth.regular]};
    color: ${props => props.theme.colors.font.secondary};
`;

export const H5 = styled.h5<Paragraph>`
    margin: 0px;
    font-size: 16px;
    text-align: center;
    font-weight: ${props => weigth[props.weigth || weigth.regular]};
    color: ${props => props.theme.colors.font.secondary};
`;

export const H6 = styled.h6<Paragraph>`
    font-size: 14px;
    text-align: center;
    font-weight: ${weigth['regular']};
    color: ${props => props.theme.colors.font[props.color]};
`;