import { contracts } from 'lib/contract'

export const getBalance = async (address: string, coinName: string, decimals) => {
    try {
        // const decimals = await contracts[coinName].decimals();
        if(decimals === 18) {
            return BigInt((await contracts[coinName].balanceOf(address)).toString());    
        } else {
            return BigInt((await contracts[coinName].balanceOf(address)).toString()) * BigInt(Math.pow(10, 18 - decimals).toString());
        }
    } catch(e) {
        console.log(e);
    }
    return 0n
};

// export const getBalances = async (address: string) => {
//     return await periFinance.js.collateral(address);
// };