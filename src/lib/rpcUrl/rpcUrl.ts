export const INFURA_ID: string = process.env.REACT_APP_INFURA_API_KEY;

export const RPC_URLS: object = {
	1: `https://mainnet.infura.io/v3/${INFURA_ID}`,
	3: `https://ropsten.infura.io/v3/${INFURA_ID}`,
	4: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
	5: `https://goerli.infura.io/v3/${INFURA_ID}`,
	42: `https://kovan.infura.io/v3/${INFURA_ID}`,
	56: 'https://bsc-dataseed1.bnbchain.org',
	97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
	// 137: `https://rpc-mainnet.maticvigil.com/v1/${process.env.REACT_APP_RPC_MATIC_ID}`,
	137: `https://polygon-bor-rpc.publicnode.com`,
	1284: `https://moonbeam-rpc.publicnode.com`,
	1285: `https://moonriver.public.blastapi.io`,
	1287: `https://rpc.api.moonbase.moonbeam.network`,
	8453: 'https://mainnet.base.org',
	80001: `https://polygon-mumbai-bor-rpc.publicnode.com`, // `https://polygon-mumbai-pokt.nodies.app`,// 
	84532: 'https://sepolia.base.org',
	1337: `http://localhost:8545`,
	11155111: 'https://ethereum-sepolia-rpc.publicnode.com',
};
	// 1285: `https://rpc.api.moonriver.moonbeam.network`,

export const natives = {
	1: "ETH",
	5: "ETH",
	11155111: "ETH",
	56: "BNB",
	1284: "GLMR",
	1285: "MOVR",
	97: "BNB",
	137: "MATIC",
	1287: "DEV",
	80001: "MATIC",
	8453: "ETH",
	84532: "ETH",
};