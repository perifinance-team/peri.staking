// import { useEffect, useState } from 'react';
// import { getWalletAddresses, getBalances } from 'helpers/wallet'

// const WALLET_PAGE_SIZE = 15;

// const LEDGER_DERIVATION_PATHS = [
//     { value: "44'/60'/0'/", label: "Ethereum - m/44'/60'/0'" },
//     { value: "44'/60'/", label: "Ethereum - Ledger Live - m/44'/60'" },
// ];

// const useGetWallets = (paginatorIndex) => {
//     const [wallet, setWallet] = useState([]);
//     useEffect(() => {
//         const getWallets = async () => {
//             const addresses = await getWalletAddresses(paginatorIndex);
//             const result = addresses.map( async (address) => {
//                 const balances = await getBalances(address)
//                 return {
//                     address,
//                     balances
//                 }
//             });
//             setWallet(result);
//         }
//         getWallets();
//     }, [paginatorIndex])
// }

const WalletConnection = () => {
    
    return (
        <div>WalletConnection</div>
    );
}
export default WalletConnection;