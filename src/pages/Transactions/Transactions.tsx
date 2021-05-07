import styled from 'styled-components'
import { useState, useEffect} from 'react'
import { useSelector } from "react-redux"
import { RootState } from 'config/reducers'

import { CellRight,
    CellLeft,
    Row,
    StyledTHeader,
    StyledTBody } from 'components/Table'
import { H3, H6 } from 'components/Text'
import { TableContainer, RoundContainer } from 'components/Container'
import { Select } from 'components/Select'
import Pagination from 'components/Pagination'
import { pynthetix } from 'lib'

const Transactions = () => {
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const tableHeadding = ['Type', 'Amount', 'Date']
    const PAGINATION_INDEX = 8;
    const [transactionHistory, setTransactionHistory] = useState([]);
    const transactionTypes = [
        'issued',
        'burned',
        'feesClaimed',
    ]
    const [filters, setFilters] = useState({
		events: [transactionTypes],
		dates: { from: undefined, to: undefined },
		amount: { from: undefined, to: undefined },
	});
    
    const clearFilters = () => {
		setFilters({
			events: [],
			dates: { from: undefined, to: undefined },
			amount: { from: undefined, to: undefined },
		});
	};
    const [currentPage, setCurrentPage] = useState(0);
    const {js: {issued, burned, feesClaimed}} = pynthetix as any

    useEffect(() => {
        const init = () => {
            issued({ account: currentWallet });
            burned({ account: currentWallet });
            feesClaimed({ account: currentWallet });
        }

    }, [currentWallet])

    return (
        <TransactionsContainer>
            <Title color={'primary'} weigth={'black'}>TRANSACTIONS</Title>
            <FilterContainer>
                <SelectContainer>
                    <Select
                        placeholder="Type"
                        data={transactionTypes}
                        selected={filters.events}
                        onSelect={selected => setFilters({ ...filters, ...{ events: selected } })}
                    />
                    <Select
                        placeholder="Amount"
                        type="range"
                        selected={filters.amount}
                        onSelect={selected => setFilters({ ...filters, ...{ events: selected } })}
                    />
                    <Select
                        placeholder="Date"
                        type="calendar"
                        selected={filters.dates}
                        onSelect={selected => setFilters({ ...filters, ...{ dates: selected } })}
                    ></Select>
                </SelectContainer>
                <ClearButton onClick={() => clearFilters()}>
                    <H6>Clear</H6>
                </ClearButton>
            </FilterContainer>

            <TableContainer>
                <StyledTHeader>
                    {tableHeadding.map( headding => 
                        headding === 'COIN' ?
                        (<CellLeft key={headding}> <H6 align={"left"}>{headding}</H6> </CellLeft>) :
                        (<CellRight key={headding}> <H6 align={"right"}>{headding}</H6> </CellRight>)
                    )}
                </StyledTHeader>
            </TableContainer>
            <Pagination
                disabled={transactionHistory.length === 0}
                currentPage={currentPage}
                lastPage={Math.trunc(transactionHistory.length / PAGINATION_INDEX) + 1}
                onPageChange={page => setCurrentPage(page)}
            />
        </TransactionsContainer>
    );
}
const TransactionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 50%;
    height: 100%;
    
`
const FilterContainer = styled.div`
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

`
const SelectContainer = styled.div`
    display: flex;
`
const Title = styled(H3)`
    margin: 0
`
const ClearButton = styled(RoundContainer)`
    cursor: pointer;
    height: 30px;
    padding: 0px 20px;
`
const Border = styled.div<{borderColor: string}>`
    padding-left: 7px;
	border-left: 5px solid ${props => props.borderColor};
`;

const Flex = styled.div`
    display: flex;
`;


export default Transactions;


