import styled from 'styled-components'

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const Cell = styled.div`
    flex: 1;
    height: 40px;
    vertical-align: middle;
    padding: 10px 40px;
`;

export const CellRight = styled(Cell)`
    text-align: right;
`;

export const CellLeft = styled(Cell)`
    text-align: left;
`;

export const StyledTHeader = styled(Row)`
    display: flex;
    flex-direction: row;
    background-color: ${props => props.theme.colors.background.panel};
`;

export const StyledTBody = styled.div`
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    height: 140px;
    overflow-y: scroll;
`;