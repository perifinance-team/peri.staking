export const polygon = async (networkId):Promise<string> => {
    try {
        const getNetworkInfo = await fetch(`https://gasstation.polygon.technology/v2`).then(response => response.json());
        return getNetworkInfo.standard.maxFee;
    } catch (e) {
        return '125';
    }
}

export const mumbai = async (networkId):Promise<string> => {
    try {
        const getNetworkInfo = await fetch(`https://gasstation-testnet.polygon.technology/v2`).then(response => response.json());
        return getNetworkInfo.standard.maxFee;
    } catch (e) {
        return '10';
    }
}
