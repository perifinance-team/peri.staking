import ERC20 from './contract/ERC20.json';
import { ethers } from 'ethers';
import numbro from 'numbro';

export const USDC = {
    isConnect: false,
    address: null,
    contract: null,
    signer: null,
    connect: function (signer, networkId) {        
        this.address = networkId === 1 ? process.env.REACT_APP_MAIN_USDC_ADDRESS : process.env.REACT_APP_KOVAN_USDC_ADDRESS;
        this.signer = signer;
        this.contract = new ethers.Contract(this.address, ERC20.abi, signer);
        return this;
    },

    allowance: async function (currentAddress) {
        
        return numbro(await this.contract.allowance(currentAddress, this.address)).divide(10**6).value().toString();
    },

    approve: async function () {
        return await this.contract.connect(this.signer).approve(this.address, numbro(1000000000000).multiply(10**6).value().toString());
    },

    balanceOf: async function (currentAddress) {
        return numbro(await this.contract.balanceOf(currentAddress)).divide(10**6).value();
    }

}

