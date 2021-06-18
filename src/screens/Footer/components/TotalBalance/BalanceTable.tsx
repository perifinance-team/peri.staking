import styled from 'styled-components'

import { useSelector } from "react-redux";
import { RootState } from 'config/reducers';

import { Cell,
    Row,
    StyledTHeader,
    StyledTBody } from 'components/Table'
import Asset from 'components/Asset'
import { H6 } from 'components/Text'
import { TableContainer } from 'components/Container'
import { formatCurrency } from 'lib'


const BalanceTable = () => {
    // const { t } = useTranslation();
    const { transferables } = useSelector((state: RootState) => state.balances);
    const transferablesArray = Object.keys(transferables);
    const tableHeadding = ['COIN', 'TRANSFERABLE', '$USD']
    const borderColors = ['#5271FF', '#00F0FF', '#F8B62D'];
    const currencies = [
        'PERI',
        'pUSD',
        'USDC',
    ]
    return (
        <TableContainer>
            <StyledTHeader>
                {tableHeadding.map( headding => 
                    headding === 'COIN' ?
                    (<Cell key={headding}> <H6>{headding}</H6> </Cell>) :
                    (<Cell key={headding}> <H6>{headding}</H6> </Cell>)
                )}
            </StyledTHeader>
            <StyledTBody height={160}>
                {transferablesArray.length > 0 && transferablesArray.map( (currency, index) => {
                    if(currencies.includes(currency)) {
                        return (
                            <Row key={currency}>
                                <Cell>
                                    <Flex>
                                        <Border borderColor={borderColors[index%3]}></Border>
                                        <Asset currencyName={currency} label={currency}></Asset>
                                    </Flex>
                                </Cell>
                                <Cell><H6 align={"right"}>{formatCurrency(transferables[currency].balance)}</H6></Cell>
                                <Cell><H6 align={"right"}>${formatCurrency(transferables[currency].balanceToUSD)}</H6></Cell>
                            </Row>
                        )
                    } else {
                        return null;
                    }
                })}
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