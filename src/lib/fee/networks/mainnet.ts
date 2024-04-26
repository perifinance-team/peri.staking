import { estimateGasPice } from "./base";
export const mainnet = async (networkId):Promise<string> => {
    const API_KEY = process.env.REACT_APP_ETHERSCAN_KEY;
    try {
        const getNetworkInfo = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_KEY}`).then(response => response.json());
        const { ProposeGasPrice } = getNetworkInfo.result;
        return ProposeGasPrice;
    } catch (e) {
        return '8';
    }
}

export const sepolia = async (networkId):Promise<string> => {
    try {
        const gasPrice = await estimateGasPice(11155111, "standard");
        return gasPrice.toString();
    } catch (e) {
        return '7';
    }
}