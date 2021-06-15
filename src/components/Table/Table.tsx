import styled from 'styled-components'

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const HoverRow = styled(Row)`
    cursor: pointer;
    &:hover {
        background-color: ${props => props.theme.colors.background.panel};
    };
`

export const Cell = styled.div`
    display: inline-table;
    width: 100%;
    height: 40px;
    vertical-align: middle;
    padding: 5px 20px;
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
    display: flex;
    flex-direction: row;
    background-color: ${props => props.theme.colors.background.panel};
`;

export const StyledTBody = styled.div<{'height'?: number}>`
    width: 100%;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    height: ${props => props['height'] ? `${props['height']}px` : `100%`};
    overflow-y: scroll;

    ::-webkit-scrollbar {
	    width: 7px;
    }

    ::-webkit-scrollbar-thumb {
        
        background-color:#313d8f;
        border-radius: 100px;
        background-clip: padding-box;
    }

    ::-webkit-scrollbar-track {
        margin-bottom: 10px;
        background-color: #23265f;
        border-radius: 5px;
    }
`;