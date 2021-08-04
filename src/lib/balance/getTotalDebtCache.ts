import { RPC_URLS } from 'lib/rpcUrl'
import { providers, Contract } from 'ethers'
import debtCashe from 'lib/contract/abi/debtCashe.json'
const networks = [ 1, 56, 137 ];

const debtCacheAddress = {
    1: null,
    56: '0xa960A3FB10349637e0401547380d05DFeFbf60f8',
    137: '0x2CC685fc9C1574fE8400548392067eC0B9eA1095'
}

export const getTotalDebtCache = async () => {
    let totalDebt = 0n;

    for await (let networkId of networks) {
        if(debtCacheAddress[networkId]) {
            const provider = new providers.JsonRpcProvider(RPC_URLS[networkId], networkId);
            const contract = new Contract(debtCacheAddress[networkId], debtCashe, provider);
            
            totalDebt = totalDebt + BigInt((await contract.cachedDebt()).toString());
        }
        
    }
    return totalDebt;
}