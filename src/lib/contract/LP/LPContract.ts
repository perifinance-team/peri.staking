import ERC20 from '../abi/ERC20.json';
import { contracts } from 'lib/contract'

import { ethers } from 'ethers';

const tokenAddress = {
    1: '0x3530A9461788891b7f5b94148a6E82FFa6fd236a',
    42: '0x57ed66ca0e67a97e217e617b1ba6b75e87db118d',
    56: '0xb68ebcec4c7aba66f5b8ed62e8c98b269cf918c8',
    97: '0xB28a19ec5a6f4269f47a486f467690Bd3376D203',
    137: '0x98f675b60769abc732ee59685bffa19ea3c8e81c',
    80001: '0x1357a050b0895535A173B0aaD97d1A2DEC48398B',   
}

const contractAddress = {
    1: '0xc0Ea07dA274Ab54D3A6d76293100f7370d74f0E8',
    42: '0x4c40b3E3AeC2505e801Db038821989FB0bd144fe',
    56: '0xCA4f304F58dF2231ef04E63d85C88A9D46d0ca94',
    97: '0x5e8fd0bADC50628ea179997a7669c15a2D0bF72b',
    137: '0xeFf7642144991B11DedD4c0a7e353386952fe9A5',
    80001: '0x3F01190Aa0827f4E9fF96096CC386CC1b2DA8982',
}

export const LPContract = {
    networkId: null,
    init(networkId, provider) {
        if(networkId) {
            this.networkId = networkId;
        }
        this.contract = new ethers.Contract(contractAddress[this.networkId], contracts.sources.StakingRewards.abi, provider);
        this.balanceContract = new ethers.Contract(tokenAddress[this.networkId], ERC20.abi, provider);
    },

    connect(signer) {
        this.contract = new ethers.Contract(contractAddress[this.networkId], contracts.sources.StakingRewards.abi, signer);
        this.balanceContract = new ethers.Contract(tokenAddress[this.networkId], ERC20.abi, signer);
    },

    stake: async function (amount, transactionSettings) {
        return await this.contract.stake(amount, transactionSettings);
    },

    withdraw: async function (amount, transactionSettings) {
        return await this.contract.withdraw(amount, transactionSettings);
    },

    getReward: async function (transactionSettings) {
        return await this.contract.getReward(transactionSettings);
    },

    exit: async function (transactionSettings) {
        return await this.contract.exit(transactionSettings);
    },

    getRewardForDuration: async function () {
        return await this.contract.getRewardForDuration();
    },

    stakedAmountOf: async function (currentAddress) {
        return await this.contract.balanceOf(currentAddress);
    },

    allowance: async function (currentAddress) {
        return (await this.balanceContract.allowance(currentAddress, contractAddress[this.networkId]));
    },

    approve: async function () {
        return await this.balanceContract.approve(contractAddress[this.networkId], '11579208923731619542357098500868790785326998466');
    },

    balanceOf: async function (currentAddress) {
        return await this.balanceContract.balanceOf(currentAddress);
    },
    earned: async function (currentWallet) {
        return await this.contract.earned(currentWallet);
    },
    totalStakeAmount: async function () {
        return await this.contract.totalSupply();
    },
}

