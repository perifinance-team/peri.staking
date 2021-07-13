import { PeriFinanceJs } from '@perifinance/peri-finance-js';
console.log(PeriFinanceJs);
type Pynthetix = {
	initialized: boolean,
	signers: PeriFinanceJs.signers,
	setContractSettings: any,
	js?: PeriFinanceJs | null,
	pynths?: PeriFinanceJs.contractSettings.pynths | null,
	signer?: PeriFinanceJs.contractSettings.signer | null,
	provider?: PeriFinanceJs.contractSettings.provider | null,
	utils?: PeriFinanceJs.contractSettings.utils | null,
	ethersUtils?: PeriFinanceJs.ethers.utils | null,
}

export const pynthetix: Pynthetix = {
    initialized: false,
	signers: PeriFinanceJs.signers,
	setContractSettings: function (contractSettings) {		
		this.initialized = true;
		this.js = new PeriFinanceJs(contractSettings);
		this.js['PeriFinance'] = this.js[contractSettings.networkId > 50 ? 'PeriFinanceToPolygon': 'PeriFinanceToEthereum']
		console.log(this.js);
		this.pynths = this.js.contractSettings.pynths;
		this.signer = this.js.contractSettings.signer;
		this.provider = this.js.contractSettings.provider;
		this.utils = this.js.utils;
		this.ethersUtils = this.js.ethers.utils;
		return this;
    }
}

export default pynthetix;