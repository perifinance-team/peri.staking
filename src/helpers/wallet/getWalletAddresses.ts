import { pynthetix } from 'lib'
 
export const getWalletAddresses = async (paginatorIndex: number, pageSize: number) => {
    return await pynthetix.signer.getNextAddresses(paginatorIndex, pageSize);
}