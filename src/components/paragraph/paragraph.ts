import styled from 'styled-components';

interface ParagraphProps {
    weight?: string;
    color?: string;
    align?: string;
    margin?: number;
    fontSize?: number;
}

const weight = {
    m: 500,
    sb: 600,
    b: 700,
    eb: 800
}

export const Paragraph = styled.p<ParagraphProps>`
    font-size: ${props => props.fontSize ? `${props.fontSize}rem` : '1.8rem' };
    font-weight: ${props => weight[props.weight]};
    color: ${props => props.theme.colors.font[props.color]};
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    margin: 0px;
`;