import { PynthetixJs } from 'pynthetix-js';

type Pynthetix = {
	initialized: boolean,
	signers: PynthetixJs.signers,
	setContractSettings: any,
	js?: PynthetixJs | null,
	pynths?: PynthetixJs.contractSettings.pynths | null,
	signer?: PynthetixJs.contractSettings.signer | null,
	provider?: PynthetixJs.contractSettings.provider | null,
	utils?: PynthetixJs.contractSettings.utils | null,
	ethersUtils?: PynthetixJs.ethers.utils | null,
}

export const pynthetix: Pynthetix = {
    initialized: false,
	signers: PynthetixJs.signers,
	setContractSettings: function (contractSettings) {
		this.initialized = true;
		this.js = new PynthetixJs(contractSettings);
		this.pynths = this.js.contractSettings.pynths;
		this.signer = this.js.contractSettings.signer;
		this.provider = this.js.contractSettings.provider;
		this.utils = this.js.utils;
		this.ethersUtils = this.js.ethers.utils;
    }
}

export default pynthetix;