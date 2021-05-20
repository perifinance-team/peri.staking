import ERC20 from './contract/ERC20.json';
import { ethers } from 'ethers';
import { pynthetix } from 'lib';
import numbro from 'numbro';

const { signer } = pynthetix;

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
        console.log(currentAddress);
        // this.contract.allowance(currentAddress, this.address)
        let dd = this.contract.allowance(currentAddress, "0x263d21A44C89718c1Fddd81D8eCC20411505bCb9");
        console.log(dd);
    },

    approve: function () {
        this.contract.connect(this.signer).approve('0x263d21A44C89718c1Fddd81D8eCC20411505bCb9', '11579208923731619542357098500868790785326998466');
        // this.contract.approve(this.address, '11579208923731619542357098500868790785326998466')
    },

    balanceOf: async function (currentAddress) {
        return numbro(await this.contract.balanceOf(currentAddress)).divide(10**6).value();
    }

}

