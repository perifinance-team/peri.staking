import { RPC_URLS } from 'lib/rpcUrl'
import { providers, Contract } from 'ethers'
import { contracts } from 'lib/contract'
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
            const contract = new Contract(debtCacheAddress[networkId], contracts.sources.DebtCache.abi, provider);
            let debtCache = 0n;
            try {
                debtCache = BigInt((await contract.cachedDebt()).toString());
            } catch (e) {
                debtCache = 0n;
            }
            totalDebt = totalDebt + debtCache;
        }
        
    }
    return totalDebt;
}