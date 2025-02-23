export const bsc = async (networkId):Promise<string> => {
    try {
        const getNetworkInfo = await fetch("https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey="+process.env.REACT_APP_BSCSCAN_API_KEY).then(response => response.json());
        console.log('getNetworkInfo', getNetworkInfo);
        if (getNetworkInfo.result === 'Error!') {
            return '1';
        }
        return getNetworkInfo.result.ProposeGasPrice;
    } catch (e) {
        return '2';
    }
}

