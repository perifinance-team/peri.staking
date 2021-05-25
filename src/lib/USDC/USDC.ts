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

    allowance: function (currentAddress) {
        return numbro(this.contract.allowance(currentAddress, "0x263d21A44C89718c1Fddd81D8eCC20411505bCb9")).divide(10**6).value().toString();
    },

    approve: function () {
        this.contract.connect(this.signer).approve('0x263d21A44C89718c1Fddd81D8eCC20411505bCb9', numbro(1000000000000).multiply(10**6).value().toString());
    },

    balanceOf: async function (currentAddress) {
        return numbro(await this.contract.balanceOf(currentAddress)).divide(10**6).value();
    }

}

