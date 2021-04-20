import { pynthetix } from 'lib'

export const getBalance = async (address: string, coinName: string) => {
    if(coinName === 'eth') {
        return await pynthetix.provider.getBalance(address);
    } else {
        return await pynthetix.js[coinName].balanceOf(address);
    }   
};

export const getBalances = async (address: string) => {
    return await pynthetix.js.collateral(address);
};