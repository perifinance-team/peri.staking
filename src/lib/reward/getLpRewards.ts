import { RPC_URLS } from 'lib/rpcUrl'
import { providers, Contract } from 'ethers'
import { contracts } from 'lib/contract'

const rewardsDistributionAddress = {
    1: null,
    56: '0x5c69Bf45A9dBfCdc0044eC66cdfFDCD44cd5F8f2',
    137: '0xf747063DA5721Cc9581D7D367aF58cc7ABd3077C'
}


let value = {
    1: 0n,
    56: 0n,
    97: 0n,
    137: 0n,
    80001: 0n,
    total: 0n
};

export const getLpRewards = async () => {
    if(value.total > 0n) {
        return value;
    }

    for await (let networkId of Object.keys(rewardsDistributionAddress)) {
        if(rewardsDistributionAddress[networkId]) {
            const provider = new providers.JsonRpcProvider(RPC_URLS[networkId], Number(networkId));
            const contract = new Contract(rewardsDistributionAddress[networkId], contracts.sources.RewardsDistribution.abi, provider);
            let rewardAmount = 0n;

            try {
                rewardAmount = BigInt((await contract.distributions(0)).amount.toString());
            } catch(e) {
                rewardAmount = 0n;
            }
            value[networkId] = rewardAmount;
            value['total'] = value['total'] + rewardAmount;
        }
        
    }
    return value;
}