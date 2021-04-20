import { pynthetix } from 'lib'
 
export const getWalletAddresses = async (paginatorIndex: number) => {
    return await pynthetix.signer.getNextAddresses(paginatorIndex, 10);
}