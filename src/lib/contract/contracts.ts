import { SUPPORTED_NETWORKS } from 'lib/network'
import { ethers, providers } from 'ethers'
import ERC20 from '../contract/abi/ERC20.json'
import { RPC_URLS } from 'lib/rpcUrl'
import perifinance from '@perifinance/peri-finance'
import { LPContract } from './LP'

const naming = {
    RewardEscrowV2: 'RewardEscrowV2',
    Issuer: 'Issuer',
    ExchangeRates: 'ExchangeRates',
    FeePool: 'FeePool',
    Liquidations: 'Liquidations',
    SystemSettings: 'SystemSettings',
    PynthUtil: 'PynthUtil',
    PeriFinanceEscrow: 'PeriFinanceEscrow',
    PeriFinance: ['PeriFinanceToEthereum', 'PeriFinanceToPolygon', 'PeriFinanceToBSC'],
    ExternalTokenStakeManager: 'ExternalTokenStakeManager',
    RewardsDistribution: 'RewardsDistribution',
    USDC: 'USDC',
    DAI: 'DAI',
    PynthpUSD: 'PynthpUSD'
} 

const stable = {
    56: {
        USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        DAI: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    },
    137: {
        USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
    }
}

type Contracts = {
    networkId: number
    RewardEscrow?: any
    provider?: any, 
    wallet?: any,
    Issuer?: any
    ExchangeRates?: any
    FeePool?: any
    Liquidations?: any
    SystemSettings?: any
    PynthUtil?: any
    PeriFinanceEscrow?: any
    RewardsDistribution?: any,
    PeriFinance?: any
    PynthpUSD?: any
    ExternalTokenStakeManager?: any
    addressList?: any 
    LP?: any
    USDC?: any
    DAI?: any
    init: (networkId: number) => void
    connect: (address:string) => void
    clear: () => void
    signers?: {
        RewardEscrow?: any
        Issuer?: any
        ExchangeRates?: any
        FeePool?: any
        Liquidations?: any
        SystemSettings?: any
        PynthUtil?: any
        PeriFinanceEscrow?: any
        RewardsDistribution?: any,
        PeriFinance?: any
        PynthpUSD?: any
        ExternalTokenStakeManager?: any
        addressList?: any 
        LP?: any
        USDC?: any
        DAI?: any
    }
}

export const contracts: Contracts = {
    networkId: null,
    wallet: null,
    signers: {},
    init(networkId) {
        if(networkId) {
            this.networkId = networkId;
        } else {
            return false;
        }
        this.sources = perifinance.getSource({network: SUPPORTED_NETWORKS[this.networkId].toLowerCase()});
        this.addressList = perifinance.getTarget({network: SUPPORTED_NETWORKS[this.networkId].toLowerCase()});
        this.provider = new providers.JsonRpcProvider(RPC_URLS[this.networkId], this.networkId);
        
        Object.keys(this.addressList).forEach(name => {
            if(naming[name]) {
                const source = typeof naming[name] === 'string' ? this.sources[naming[name]] : this.sources[naming[name].find(e => this.sources[e])]
                this[name] = new ethers.Contract(this.addressList[name].address, source ? source.abi : ERC20.abi, this.provider);
            }
        });
        if(stable[this.networkId]) {
            this['USDC'] = new ethers.Contract(stable[this.networkId].USDC, ERC20.abi, this.provider);
            this['DAI'] = new ethers.Contract(stable[this.networkId].DAI, ERC20.abi, this.provider);
        }
        try {
            this['LP'] = LPContract;
            this['LP'].init(this.networkId, this.provider);
        } catch(e) {
            console.log(e)
            this['LP'] = null;
        }
    },

    connect(address) {
        this.signer = new providers.Web3Provider(this.wallet.provider).getSigner(address);
        Object.keys(this.addressList).forEach(name => {
            if(naming[name]) {
                const source = typeof naming[name] === 'string' ? this.sources[naming[name]] : this.sources[naming[name].find(e => this.sources[e])]
                this.signers[name] = new ethers.Contract(this.addressList[name].address, source ? source.abi : ERC20.abi, this.signer);
            }
        });

        if(stable[this.networkId]) {
            this.signers['USDC'] = new ethers.Contract(stable[this.networkId].USDC, ERC20.abi, this.signer);
            this.signers['DAI'] = new ethers.Contract(stable[this.networkId].DAI, ERC20.abi, this.signer);
        }
        

        try {
            this.signers['LP'] = LPContract;
            this.signers['LP'].init(this.networkId, this.provider);
            this.signers['LP'].connect(this.signer);
        } catch(e) {
            console.log(e);
            this.signers['LP'] = null;
        }
    },
    clear() {
        this.wallet = null;
        this.networkId = Number(process.env.REACT_APP_DEFAULT_NETWORK_ID);
        this.sources = perifinance.getSource({network: SUPPORTED_NETWORKS[this.networkId].toLowerCase()});
        this.addressList = perifinance.getTarget({network: SUPPORTED_NETWORKS[this.networkId].toLowerCase()});
        this.provider = new providers.JsonRpcProvider(RPC_URLS[this.networkId], this.networkId);
        
        Object.keys(this.addressList).forEach(name => {
            if(naming[name]) {
                const source = typeof naming[name] === 'string' ? this.sources[naming[name]] : this.sources[naming[name].find(e => this.sources[e])]
                this[name] = new ethers.Contract(this.addressList[name].address, source ? source.abi : ERC20.abi, this.provider);
            }
        });
        if(stable[this.networkId]) {
            this['USDC'] = new ethers.Contract(stable[this.networkId].USDC, ERC20.abi, this.provider);
            this['DAI'] = new ethers.Contract(stable[this.networkId].DAI, ERC20.abi, this.provider);
        }

        try {
            this['LP'] = LPContract;
            this['LP'].init(this.networkId, this.provider);
        } catch(e) {
            console.log(e)
            this['LP'] = null;
        }
    }
}