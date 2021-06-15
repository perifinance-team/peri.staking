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
    const { balances, debtBalance } = useSelector((state: RootState) => state.balances);
    const tableHeadding = ['COIN', 'BALANCE', '$USD']
    const borderColors = ['#5271FF', '#00F0FF', '#F8B62D'];
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
                <Row key={debtBalance}>
                    <Cell>
                        <Flex>
                            <Border borderColor={borderColors[0]}></Border>
                            <Asset currencyName={'pUSD'} label={'DEBT'}></Asset>
                        </Flex>
                    </Cell>
                    <Cell><H6>{formatCurrency(debtBalance)}</H6></Cell>
                    <Cell><H6>${formatCurrency(debtBalance)}</H6></Cell>
                </Row>
                {balances.length > 0 && balances.map( (currency, index) => {
                    
                    return (
                        <Row key={currency?.coinName}>
                            <Cell>
                                <Flex>
                                    <Border borderColor={borderColors[index%3]}></Border>
                                    <Asset currencyName={currency?.coinName} label={currency?.coinName}></Asset>
                                </Flex>
                            </Cell>
                            <Cell><H6>{formatCurrency(currency?.balance)}</H6></Cell>
                            <Cell><H6>${formatCurrency(currency?.balanceToUSD)}</H6></Cell>
                        </Row>
                    )
                    }
                )}
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