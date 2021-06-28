import ERC20 from '../contract/ERC20.json';
import StakingRewards from '../contract/StakingRewards.json'
import { ethers, utils } from 'ethers';
import { getEthereumNetworkId } from 'lib/ethereum'
import { pynthetix } from 'lib'
const addressList = {
    KOVAN: '0x57ed66ca0e67a97e217e617b1ba6b75e87db118d',
}

export const LPContract = {
    isConnect: false,
    address: null,
    contract: null,
    signer: null,
    connect: async function (signer, networkName) {
        const { js: { PeriFinance } }  = pynthetix as any;
        this.address = PeriFinance.contractSettings.addressList['StakingRewardsPERIUniV2'];
        this.signer = signer;
        this.contract = new ethers.Contract(this.address, StakingRewards, signer);
        console.log(this.contract);
        this.balanceContract = new ethers.Contract(addressList[networkName], ERC20.abi, signer);
        return this;
    },

    stake: async function (amount, transactionSettings) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return await this.contract.stake(amount, transactionSettings);
    },

    withdraw: async function (amount, transactionSettings) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return await this.contract.withdraw(amount, transactionSettings);
    },

    getReward: async function (transactionSettings) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return await this.contract.getReward(transactionSettings);
    },

    exit: async function (transactionSettings) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return await this.contract.exit(transactionSettings);
    },

    getRewardForDuration: async function () {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        console.log(this.contract);
        return await this.contract.getRewardForDuration();
    },

    getStakingAmount: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        
        return await this.contract.balanceOf(currentAddress);
    },

    allowance: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return (await this.balanceContract.allowance(currentAddress, this.address));
    },

    approve: async function () {
        if(!this.balanceContract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        
        return await this.balanceContract.approve(this.address, '11579208923731619542357098500868790785326998466');
    },

    balanceOf: async function (currentAddress) {
        if(!this.balanceContract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        
        return await this.balanceContract.balanceOf(currentAddress);
    },
    earned: async function (currentWallet) {
        if(!this.balanceContract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return await this.contract.earned(currentWallet);
    }

}

