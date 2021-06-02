import ERC20 from '../contract/ERC20.json';
import { ethers, utils } from 'ethers';
import { getEthereumNetworkId } from 'lib/ethereum'
import { pynthetix } from 'lib'

export const RewardEscrow = {
    isConnect: false,
    address: null,
    contract: null,
    signer: null,
    connect: async function (signer) {
        const { js: { PeriFinance } }  = pynthetix as any;
        this.address = await PeriFinance.getRequiredAddress(utils.formatBytes32String('RewardEscrowV2'))
        this.signer = signer;
        this.contract = new ethers.Contract(this.address, ERC20.abi, signer);
        return this;
    },

    balanceOf: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        
        return await this.contract.balanceOf(currentAddress);
    }

}

