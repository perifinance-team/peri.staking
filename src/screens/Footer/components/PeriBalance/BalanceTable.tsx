import styled from 'styled-components'
import { CellRight,
    CellLeft,
    Row,
    StyledTHeader,
    StyledTBody } from 'components/Table'
import Asset from 'components/Asset'
import { H6 } from 'components/Text'
import { TableContainer } from 'components/Container'
const BalanceTable = () => {
    // const { t } = useTranslation();
    const tableHeadding = ['COIN', 'BALANCE', '$USD']
    const tableData = [{
        name: 'PERI',
        balance: '123,123',
        valueUSD: '123,123,123',
    }
]
    const borderColors = ['#5271FF', '#00F0FF', '#F8B62D'];
    return (
        <TableContainer>
            <StyledTHeader>
                {tableHeadding.map( headding => 
                    headding === 'COIN' ?
                    (<CellLeft key={headding}> <H6 align={"left"}>{headding}</H6> </CellLeft>) :
                    (<CellRight key={headding}> <H6 align={"right"}>{headding}</H6> </CellRight>)
                )}
            </StyledTHeader>
            <StyledTBody className="dd">
                {tableData.map( (data, index) => (
                    <Row key={data.name}>
                        <CellLeft>
                            <Flex>
                                <Border borderColor={borderColors[index%3]}></Border>
                                <Asset currencyName={data.name} label={data.name}></Asset>
                            </Flex>
                        </CellLeft>
                        <CellRight><H6 align={"right"}>{data.balance}</H6></CellRight>
                        <CellRight><H6 align={"right"}>${data.valueUSD}</H6></CellRight>
                    </Row>
                ))}
            </StyledTBody>
        </TableContainer>
    );
}

const Border = styled.div<{borderColor: string}>`
    padding-left: 7px;
	border-left: 5px solid ${props => props.borderColor};
`;

const Flex = styled.div`
    display: flex;
`;

export default BalanceTable;