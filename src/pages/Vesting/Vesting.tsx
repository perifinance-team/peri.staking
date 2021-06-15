import styled from 'styled-components'
import { useState, useEffect} from 'react'
import { useSelector } from "react-redux"
import { RootState } from 'config/reducers'

import { CellRight,
    CellLeft,    
    StyledTHeader,
} from 'components/Table'
import { H3, H6 } from 'components/Text'
import { TableContainer, RoundContainer } from 'components/Container'
import { Select } from 'components/Select'
import Pagination from 'components/Pagination'
import { pynthetix } from 'lib'

const Transactions = () => {
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const {js: {issued, burned, feesClaimed}} = pynthetix as any

    useEffect(() => {
        const init = () => {
        }
        init();
        // eslint-disable-next-line
    }, [currentWallet])

    return (
        <>
            <div>
                123
            </div>
            <div>
                312
            </div>
        </>
    );
}


export default Transactions;


