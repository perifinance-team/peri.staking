import ERC20 from '../contract/ERC20.json';
import { ethers, utils } from 'ethers';
import { getEthereumNetworkId } from 'lib/ethereum'
import { pynthetix } from 'lib'

export const USDC = {
    isConnect: false,
    address: null,
    contract: null,
    signer: null,
    connect: async function (signer, networkName) {
        const { js: { PeriFinance } }  = pynthetix as any;
        this.issuerAddress = await PeriFinance.getRequiredAddress(utils.formatBytes32String('Issuer'));
        this.address = process.env[`REACT_APP_${networkName}_USDC_ADDRESS`];
        this.signer = signer;
        this.contract = new ethers.Contract(this.address, ERC20.abi, signer);
        return this;
    },
    // formatBytes32String
    allowance: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        return (await this.contract.allowance(currentAddress, this.issuerAddress)).mul(10**12);
    },

    approve: async function () {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        
        return await this.contract.connect(this.signer).approve(this.issuerAddress, '11579208923731619542357098500868790785326998466');
    },

    balanceOf: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        
        return ((await this.contract.balanceOf(currentAddress)).mul(10**12));
    }

}

