import styled from 'styled-components'

export const Row = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 45px;
`;

export const BorderRow = styled(Row)`
    border-bottom: ${props => `1px solid ${props.theme.colors.border.tableRow}`};
`

export const HoverRow = styled(Row)`
    cursor: pointer;
    &:hover {
        background-color: ${props => props.theme.colors.background.panel};
    };
`

export const Cell = styled.div`
    display: inline-table;
    width: 100%;
    vertical-align: middle;
`;

export const HeaderCellRight = styled(Cell)`
    text-align: right;
`;

export const HeaderCellLeft = styled(Cell)`
    padding: 10px 6 0px;
    text-align: left;
`;

export const CellRight = styled(Cell)`
    text-align: right;
`;

export const CellLeft = styled(Cell)`
    text-align: left;
`;

export const StyledTHeader = styled(Row)`
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    background-color: ${props => props.theme.colors.background.THeader};
`;

export const StyledTBody = styled.div<{'height'?: number}>`
    width: 100%;
    display: flex;
    flex-direction: column;
    height: ${props => props['height'] ? `${props['height']}vh` : `100%`};
    overflow-y: scroll;
`;