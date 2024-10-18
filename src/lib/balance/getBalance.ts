import { contracts } from 'lib/contract'

export const getBalance = async (address: string, coinName: string, decimals:number) => {
    // console.log(`contracts[${coinName}]`,contracts[coinName], "decimals", decimals);

    try {
        // const decimals = await contracts[coinName].decimals();
        if(decimals === 18) {
            return BigInt((await contracts[coinName].balanceOf(address)).toString());    
        } else {
            const balance = BigInt((await contracts[coinName].balanceOf(address)).toString());
            return balance * BigInt((10**(18 - decimals)).toString());
        }
    } catch(e) {
        console.log(e);
    }
    return 0n
};

// export const getBalances = async (address: string) => {
//     return await periFinance.js.collateral(address);
// };