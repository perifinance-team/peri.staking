import ERC20 from '../contract/ERC20.json';
import { ethers, utils } from 'ethers';
import { getEthereumNetworkId } from 'lib/ethereum'
import { pynthetix } from 'lib'

const addressList = {
    KOVAN: '0x98da9a82224E7A5896D6227382F7a52c82082146',
    MUMBAI: '0xcE954FC4c52A9E6e25306912A36eC59293da41E3',
    MAINNET: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    MATIC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
}

export const USDCContract = {
    isConnect: false,
    address: null,
    contract: null,
    signer: null,
    connect: async function (signer, networkName) {
        const { js: { PeriFinance } }  = pynthetix as any;
        console.log(123);
        this.issuerAddress = await PeriFinance.getRequiredAddress(utils.formatBytes32String('Issuer'));
        console.log(this.issuerAddress);
        this.address = addressList[networkName];
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
        
        return await this.contract.approve(this.issuerAddress, '11579208923731619542357098500868790785326998466');
    },

    balanceOf: async function (currentAddress) {
        if(!this.contract) {
            await this.connect(pynthetix.signer, await getEthereumNetworkId());
        }
        
        return ((await this.contract.balanceOf(currentAddress)).mul(10**12));
    }

}

