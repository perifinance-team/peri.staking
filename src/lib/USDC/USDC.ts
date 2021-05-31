import ERC20 from './contract/ERC20.json';
import { ethers, utils } from 'ethers';
import { getEthereumNetworkId } from 'lib/ethereum'
import numbro from 'numbro';
import { pynthetix } from 'lib'

export const USDC = {
    isConnect: false,
    address: null,
    contract: null,
    signer: null,
    connect: async function (signer, networkId) {
        const { js: { PeriFinance } }  = pynthetix as any;
        this.issuerAddress = await PeriFinance.getRequiredAddress(utils.formatBytes32String('Issuer'));
        this.address = networkId === 1 ? process.env.REACT_APP_MAIN_USDC_ADDRESS : process.env.REACT_APP_KOVAN_USDC_ADDRESS;
        this.signer = signer;
        this.contract = new ethers.Contract(this.address, ERC20.abi, signer);
        return this;
    },
    // formatBytes32String
    allowance: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return numbro(await this.contract.allowance(currentAddress, this.issuerAddress)).divide(10**6).value().toString();
    },

    approve: async function () {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return await this.contract.connect(this.signer).approve(this.issuerAddress, numbro(1000000000000).multiply(10**6).value().toString());
    },

    balanceOf: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return numbro(await this.contract.balanceOf(currentAddress)).divide(10**6).value();
    }

}

