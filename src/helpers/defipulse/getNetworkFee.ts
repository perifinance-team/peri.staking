import numbro from 'numbro';

export const getNetworkFee = async (networkId) => {
    const API_KEY = process.env.REACT_APP_DEFIPULSE_API_KEY;
    try {
        const getNetworkInfo = 
            networkId < 50 ? 
            await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${API_KEY}`).then(response => response.json()) :
            await fetch('https://gasstation-mainnet.matic.network').then(response => response.json());

        
        const blockTime = getNetworkInfo.block_time || getNetworkInfo.blockTime;


        return {
            AVERAGE: {
                price: networkId < 50 ? numbro(getNetworkInfo.average).divide(10).value() : Math.ceil(getNetworkInfo.standard),
                wait: numbro(blockTime).multiply(getNetworkInfo.avgWait || getNetworkInfo.fastest).value()
            },
            FAST: {
                price: networkId < 50 ? numbro(getNetworkInfo.fast).divide(10).value() : Math.ceil(getNetworkInfo.fast),
                wait: numbro(blockTime).multiply(getNetworkInfo.fastWait || getNetworkInfo.fastest).value()
            },
        }
    } catch (e) {
        return {
            AVERAGE: {
                price: 42,
                wait: 0
            },
            FAST: {
                price: 42,
                wait: 0
            }
        }
    }
    
}