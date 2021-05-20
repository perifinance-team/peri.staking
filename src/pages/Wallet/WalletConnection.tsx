import styled from 'styled-components'

import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux"

import { setIsLoading } from 'config/reducers/app'

import { getWalletAddresses } from 'helpers/wallet'
import { NotificationManager } from 'react-notifications';
import { getBalancess, formatCurrency, pynthetix } from 'lib'
import { updateWallet, updateIsConnected } from 'config/reducers/wallet'

import { CellRight,
    Cell,
    Row,
    StyledTHeader,
    StyledTBody } from 'components/Table'
import Asset from 'components/Asset'
import { H6 } from 'components/Text'
import { TableContainer } from 'components/Container'
import Pagination from 'components/Pagination'

const WALLET_PAGE_SIZE = 15;

// const LEDGER_DERIVATION_PATHS = [
//     { value: "44'/60'/0'/", label: "Ethereum - m/44'/60'/0'" },
//     { value: "44'/60'/", label: "Ethereum - Ledger Live - m/44'/60'" },
// ];

const WalletConnection = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [wallets, setWallets] = useState([]);
    const [paginatorIndex, setPaginatorIndex] = useState(0);
    
    useEffect(() => {
        const getWallets = async () => {
            dispatch(setIsLoading(true));
            try {
                if(!wallets[paginatorIndex]) {
                    const addresses = await getWalletAddresses(paginatorIndex, WALLET_PAGE_SIZE);
 
                    let balances = [];

                    for await (let address of addresses) {
                        const balance = await getBalancess(address);
                        balances.push({
                                address,
                                PERI: balance.balances.find(e=>e.coinName === 'PERI'),
                                pUSD: balance.balances.find(e=>e.coinName === 'pUSD'),
                                ETH: balance.balances.find(e=>e.coinName === 'ETH'),
                        });
                    }
                    let wallet = [...wallets];
                    wallet[paginatorIndex] = balances;

                    setWallets(wallet);
                }
            } catch(e) {
                NotificationManager.error('Could not get addresses from wallet', 'wallet connection error', 5000)
                history.push('/login');
                console.log(e)
            }
            dispatch(setIsLoading(false));
            
        }
        getWallets();
        // eslint-disable-next-line
    }, [paginatorIndex]);

    const connetWallet = (address, index) => {
        const walletIndex = paginatorIndex * WALLET_PAGE_SIZE + index;
        pynthetix.signer.setAddressIndex(walletIndex);
        dispatch(updateWallet({currentWallet: address}));
        dispatch(updateIsConnected(true));
        history.push('/');
    }

    return (
        <Container>
            <TableContainer>
                <StyledTHeader>
                    {['address', 'PERI', 'pUSD', 'ETH'].map( headding => 
                        headding !== 'address' ?
                        (<CurrencyCell key={headding}> <Asset currencyName={headding} label={headding}></Asset> </CurrencyCell>) :
                        (<AddressCell key={headding}> <H6> {headding} </H6> </AddressCell>)
                    )}
                </StyledTHeader>
                <StyledTBody height={610}>
                    {wallets[paginatorIndex] && wallets[paginatorIndex].map((wallet, i) => {
                        return (
                            <StyledRow key={wallet.address+i} onClick={() => connetWallet(wallet.address, i)}>
                                <AddressCell>
                                    <H6 align={"left"}>{wallet.address}</H6>
                                </AddressCell>
                                <CurrencyCell><H6 align={"right"}>{formatCurrency(wallet['PERI'])}</H6></CurrencyCell>
                                <CurrencyCell><H6 align={"right"}>{formatCurrency(wallet['pUSD'])}</H6></CurrencyCell>
                                <CurrencyCell><H6 align={"right"}>{formatCurrency(wallet['ETH'])}</H6></CurrencyCell>
                            </StyledRow>
                        )}
                    )}
                </StyledTBody>
            </TableContainer>
            <Pagination
                disabled={false}
                currentPage={paginatorIndex}
                lastPage={Math.trunc(100 / paginatorIndex) + 1}
                onPageChange={page => setPaginatorIndex(page)}
            />
        </Container>
    );
}

const Container = styled.div`
    width: 1000px;
    margin: 0 auto;
`

const AddressCell = styled(Cell)`
    flex: none;
    width: 400px;
`

const CurrencyCell = styled(CellRight)`
    width: 200px;
    h6 {
        width: 100px;
    }
`

const StyledRow = styled(Row)`
    cursor: pointer;
    :hover {
        background: ${props => props.theme.colors.hover.background};
    }
`

export default WalletConnection;