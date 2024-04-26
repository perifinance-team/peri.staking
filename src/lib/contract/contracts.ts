import perifinance from "@perifinance/peri-finance";

import { SUPPORTED_NETWORKS } from "lib/network";

import { ethers, providers } from "ethers";

import { RPC_URLS } from "lib/rpcUrl";

import ERC20 from "../contract/abi/ERC20.json";

import { LPContract, lpContractAddress } from "./LP";

const naming = {
	Exchanger:"Exchanger",
	RewardEscrowV2: "RewardEscrowV2",
	Issuer: "Issuer",
	ExchangeRates: "ExchangeRates",
	ProxyFeePool: "FeePool",
	Liquidations: "Liquidations",
	SystemSettings: "SystemSettings",
	PynthUtil: "PynthUtil",
	PeriFinanceEscrow: "PeriFinanceEscrow",
	ProxyERC20: {
		1: "PeriFinanceToEthereum",
		5: "PeriFinanceToEthereum",
		42: "PeriFinanceToEthereum",
		56: "PeriFinanceToBSC",
		97: "PeriFinanceToBSC",
		137: "PeriFinanceToPolygon",
		1284: "PeriFinance",
		1285: "PeriFinance",
		1287: "PeriFinance",
		8453: "PeriFinance",
		1337: true ? "PeriFinanceToPolygon" : "PeriFinanceToEthereum",
		80001: "PeriFinanceToPolygon",
		84532: "PeriFinance",
		11155111: "PeriFinanceToEthereum",
	},
	ExternalTokenStakeManager: "ExternalTokenStakeManager",
	RewardsDistribution: "RewardsDistribution",
	USDC: "USDC",
	DAI: "DAI",
	ProxyERC20pUSD: "MultiCollateralPynth",
    ProxyERC20pBTC: "MultiCollateralPynth",
    ProxyERC20pETH: "MultiCollateralPynth",
    ProxyERC20pBNB: "MultiCollateralPynth",
    ProxyERC20p1INCH: "MultiCollateralPynth",
    ProxyERC20pAAVE: "MultiCollateralPynth",
    ProxyERC20pANKR: "MultiCollateralPynth",
    ProxyERC20pAVAX: "MultiCollateralPynth",
    ProxyERC20pAXS: "MultiCollateralPynth",
    ProxyERC20pCAKE: "MultiCollateralPynth",
    ProxyERC20pCOMP: "MultiCollateralPynth",
    ProxyERC20pCRV: "MultiCollateralPynth",
    ProxyERC20pDOT: "MultiCollateralPynth",
    ProxyERC20pEUR: "MultiCollateralPynth",
    ProxyERC20pLINK: "MultiCollateralPynth",
    ProxyERC20pLUNA: "MultiCollateralPynth",
    ProxyERC20pMANA: "MultiCollateralPynth",
    ProxyERC20pMKR: "MultiCollateralPynth",
    ProxyERC20pSAND: "MultiCollateralPynth",
    ProxyERC20pSNX: "MultiCollateralPynth",
    ProxyERC20pSUSHI: "MultiCollateralPynth",
    ProxyERC20pUNI: "MultiCollateralPynth",
    ProxyERC20pXRP: "MultiCollateralPynth",
    ProxyERC20pYFI: "MultiCollateralPynth",
    ProxyERC20pSOL: "MultiCollateralPynth",
	ProxyERC20pMATIC: "MultiCollateralPynth",
};

export const stable = {
	1: {
		USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
		DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
		USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
		PAXG: "0x45804880De22913dAFE09f4980848ECE6EcbAf78",
		XAUT: "0x68749665FF8D2d112Fa859AA293F07A622782F38",
	},
	56: {
		USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
		DAI: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
		USDT: "0x55d398326f99059ff775485246999027b3197955",
		PAXG: "0x7950865a9140cB519342433146Ed5b40c6F210f7",
	},
	137: {
		USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
		DAI: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
		USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
		PAXG: "0x553d3D295e0f695B9228246232eDF400ed3560B5",
	},
	97: {
		USDC: "0x8EDc640693b518c8d531A8516A5C0Ae98b641a03",
		DAI: "0x52306d4521eFF70Ba555A578a66705b3352e8B3a",
		PAXG: "0xd3145aB4D7271740C1d4BdB0deD5CDEE0d08ee10",
	},
	1284: {
		USDC: "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
		DAI: "0x06e605775296e851FF43b4dAa541Bb0984E9D6fD",
		USDT: "0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73",
	},
	1285: {
		USDC: "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D",
		DAI: "0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844",
		USDT: "0xB44a9B6905aF7c801311e8F4E76932ee959c663C",
	},
	1287: {
		USDC: "0xDF17D7AaCC4cE7f675d3600A07b3CEA843F3669f",
		DAI: "0x33B86de94702C5Ff1ECba36D38Ea2Fc238894315",
		USDT: "0x321449E0Be9798881e11925666aBaA324162930B",
		XAUT: "0xFA85FfEf4186339892557bb80E4F9C5F3E4df97f",
		PAXG: "0xE00A06E4938c015ba83F3AcB7B3499B36cf58502",
	},
	80001: {
		USDC: "0xcE954FC4c52A9E6e25306912A36eC59293da41E3",
		DAI: "0xAcC78d249781EDb5feB50027971EF4D60f144325",
		USDT: "0xbf56f5Af97F6818f451F92ca917D8eeb87BbEc7c",
		XAUT: "0xc20c3c3Ff7C418C6372287106b1668ae40c1bC39",
		PAXG: "0x644eAb1a0Ed9E034ad9eDFe75dbE67D614Fb7e7f",
	},
	8453: {
		USDC: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
		DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
	},
	84532: {
		USDC: "0xfec043ba43c733069CBc2243b36bc4fa33AFcC28",
		DAI: "0x1AdC5b1bca919F59a00FC0fE8646C9e9C41338Eb",
	},
	1337: {
		USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
		DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
	},
	11155111: {
		USDC: "0x38d4e2EefDD05970f7d198F74E25D94e70D049D5",
		DAI: "0x4ABf615437fb7eCE1b6702E57B23a7547F945545",
		USDT: "0x2436953d15Ae8b9119c787e1d50e393aFEe3426A",
		XAUT: "0x16B7Cf4F16608D76aEAD2b7b10f85090EfC7B746",
		PAXG: "0x0567327A31A812344B71e6f95a64626EB72c1B22",
	}
};

type Contracts = {
	networkId: number;
	sources?: any;
	RewardEscrow?: any;
	provider?: any;
	wallet?: any;
	Issuer?: any;
	RewardsDistribution?: any;
	ExchangeRates?: any;
	FeePool?: any;
	Liquidations?: any;
	SystemSettings?: any;
	PynthUtil?: any;
	PeriFinanceEscrow?: any;
	PeriFinance?: any;
	PynthpUSD?: any;
	ExternalTokenStakeManager?: any;
	addressList?: any;
	LP?: any;
	USDC?: any;
	DAI?: any;
	USDT?: any;
	XAUT?: any;
	PAXG?: any;
	init: (networkId: number) => void;
	connect: (address: string) => void;
	clear: () => void;
	signers?: {
		RewardEscrow?: any;
		Issuer?: any;
		ExchangeRates?: any;
		FeePool?: any;
		Liquidations?: any;
		SystemSettings?: any;
		PynthUtil?: any;
		PeriFinanceEscrow?: any;
		PeriFinance?: any;
		PynthpUSD?: any;
		ExternalTokenStakeManager?: any;
		addressList?: any;
		LP?: any;
		USDC?: any;
		DAI?: any;
		USDT?: any;
		XAUT?: any;
		PAXG?: any;
	};
};

export const contracts: Contracts = {
	networkId: null,
	wallet: null,
	signers: {},
	init(networkId) {
		if (networkId) {
			this.networkId = networkId;
		} else {
			return false;
		}
		try {
			this.sources = perifinance.getSource({
				network: SUPPORTED_NETWORKS[this.networkId]?.toLowerCase(),
			});
			this.addressList = perifinance.getTarget({
				network: SUPPORTED_NETWORKS[this.networkId]?.toLowerCase(),
			});
		} catch (error) {
			console.log(error);
			return false;
		}
		
		this.provider = new providers.JsonRpcProvider(RPC_URLS[this.networkId], this.networkId);

		Object.keys(this.addressList).forEach((name) => {
			if (naming[name]) {
				const source = typeof naming[name] === "string" ? this.sources[naming[name]] : this.sources[naming[name][this.networkId]];
				this[name] = new ethers.Contract(this.addressList[name].address, source ? source.abi : ERC20.abi, this.provider);

				if (name === "ProxyERC20") {
					this["PeriFinance"] = this[name];
				}
				if (name === "ProxyFeePool") {
					this["FeePool"] = this[name];
				}
				if (name === "ProxyERC20pUSD") {
					this["PynthpUSD"] = this[name];
				}
			}
		});

		if (stable[this.networkId]) {
			Object.keys(stable[this.networkId]).forEach((name) => {
				this[name] = new ethers.Contract(stable[this.networkId][name], ERC20.abi, this.provider);
			});
			// this["USDC"] = new ethers.Contract(stable[this.networkId].USDC, ERC20.abi, this.provider);
			// this["DAI"] = new ethers.Contract(stable[this.networkId].DAI, ERC20.abi, this.provider);
		}
		try {
			if (lpContractAddress[this.networkId]){
				this["LP"] = LPContract;
				this["LP"].init(this.networkId, this.provider);
			}
		} catch (e) {
			console.log(e);
			this["LP"] = null;
		}
	},

	connect(address) {
		this.signer = new providers.Web3Provider(this.wallet.provider).getSigner(address);

		Object.keys(this.addressList).forEach((name) => {
			if (naming[name]) {
				const source = typeof naming[name] === "string" ? this.sources[naming[name]] : this.sources[naming[name][this.networkId]];
				this.signers[name] = new ethers.Contract(this.addressList[name].address, source ? source.abi : ERC20.abi, this.signer);
				if (name === "ProxyERC20") {
					this.signers["PeriFinance"] = this.signers[name];
				}

				if (name === "ProxyFeePool") {
					this.signers["FeePool"] = this.signers[name];
				}
				if (name === "ProxyERC20pUSD") {
					this.signers["PynthpUSD"] = this.signers[name];
				}
			}
		});

		if (stable[this.networkId]) {
			Object.keys(stable[this.networkId]).forEach((name) => {
				this.signers[name] = new ethers.Contract(stable[this.networkId][name], ERC20.abi, this.signer);
			});
		}

		try {
			if (lpContractAddress[this.networkId]){
				this.signers["LP"] = LPContract;
				this.signers["LP"].init(this.networkId, this.provider);
				this.signers["LP"].connect(this.signer);
			}
		} catch (e) {
			console.log(e);
			this.signers["LP"] = null;
		}
	},
	clear() {
		this.wallet = null;
		this.networkId = Number(process.env.REACT_APP_DEFAULT_NETWORK_ID);
		this.sources = perifinance.getSource({
			network: SUPPORTED_NETWORKS[this.networkId].toLowerCase(),
		});
		this.addressList = perifinance.getTarget({
			network: SUPPORTED_NETWORKS[this.networkId].toLowerCase(),
		});
		this.provider = new providers.JsonRpcProvider(RPC_URLS[this.networkId], this.networkId);

		Object.keys(this.addressList).forEach((name) => {
			if (naming[name]) {
				const source = typeof naming[name] === "string" ? this.sources[naming[name]] : this.sources[naming[name][this.networkId]];
				this[name] = new ethers.Contract(this.addressList[name].address, source ? source.abi : ERC20.abi, this.provider);
				if (name === "ProxyERC20") {
					this["PeriFinance"] = this[name];
				}
				if (name === "ProxyFeePool") {
					this["FeePool"] = this[name];
				}
				if (name === "ProxyERC20pUSD") {
					this["PynthpUSD"] = this[name];
				}
			}
		});
		if (stable[this.networkId]) {
			this["USDC"] = new ethers.Contract(stable[this.networkId].USDC, ERC20.abi, this.provider);
			this["DAI"] = new ethers.Contract(stable[this.networkId].DAI, ERC20.abi, this.provider);
		}

		try {
			if (lpContractAddress[this.networkId]){
				this["LP"] = LPContract;
				this["LP"].init(this.networkId, this.provider);
			}
		} catch (e) {
			console.log(e);
			this["LP"] = null;
		}
	},
};
