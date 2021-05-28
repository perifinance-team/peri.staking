import ERC20 from './contract/ERC20.json';
import { ethers } from 'ethers';
import numbro from 'numbro';
import { pynthetix } from 'lib'
export const USDC = {
    isConnect: false,
    address: null,
    contract: null,
    signer: null,
    connect: function (signer, networkId) {
        const { js: { Issuer } }  = pynthetix as any;
        this.issuerAddress = Issuer.contract.address;
        this.address = networkId === 1 ? process.env.REACT_APP_MAIN_USDC_ADDRESS : process.env.REACT_APP_KOVAN_USDC_ADDRESS;
        this.signer = signer;
        this.contract = new ethers.Contract(this.address, ERC20.abi, signer);
        return this;
    },

    allowance: async function (currentAddress) {
        
        return numbro(await this.contract.allowance(currentAddress, this.issuerAddress)).divide(10**6).value().toString();
    },

    approve: async function () {
        return await this.contract.connect(this.signer).approve(this.issuerAddress, numbro(1000000000000).multiply(10**6).value().toString());
    },

    balanceOf: async function (currentAddress) {
        return numbro(await this.contract.balanceOf(currentAddress)).divide(10**6).value();
    }

}

