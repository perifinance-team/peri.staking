import ERC20 from '../contract/ERC20.json';
import { ethers, utils } from 'ethers';
import { getEthereumNetworkId } from 'lib/ethereum'
import { pynthetix } from 'lib'

export const LPContract = {
    isConnect: false,
    address: null,
    contract: null,
    signer: null,
    connect: async function (signer) {
        console.log()
        const { js: { PeriFinance } }  = pynthetix as any;
        console.log(PeriFinance);
        this.address = PeriFinance.contractSettings.addressList['StakingRewardsPERIUniV2'];
        this.signer = signer;
        this.contract = new ethers.Contract(this.address, ERC20.abi, signer);
        this.balanceContract = new ethers.Contract(PeriFinance.contractSettings.addressList['PERIUniswapV2'], ERC20.abi, signer);
        return this;
    },

    staking: async function (amount) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return await this.contract.stake(amount);
    },

    withdraw: async function () {

    },

    getReward: async function (currentAddress) {

    },

    exit: async function () {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return await this.contract.exit();
    },

    getRewardForDuration: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return await this.contract.getRewardForDuration(currentAddress);
    },

    getStakingAmount: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        
        return await this.contract.balanceOf(currentAddress);
    },

    balanceOf: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        
        return await this.contract.balanceOf(currentAddress);
    },

}

