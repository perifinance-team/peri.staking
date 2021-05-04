import numbro from 'numbro';

export const getNetworkFee = async () => {
    const API_KEY = process.env.REACT_APP_DEFIPULSE_API_KEY;
    try {
        const getNetworkInfo = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${API_KEY}`).then(response => response.json());
        const blockTime = getNetworkInfo.block_time;
        return {
            AVERAGE: {
                price: numbro(getNetworkInfo.average).divide(10).value(),
                wait: numbro(blockTime).multiply(getNetworkInfo.avgWait).value()
            },
            FAST: {
                price: numbro(getNetworkInfo.fast).divide(10).value(),
                wait: numbro(blockTime).multiply(getNetworkInfo.fastWait).value()
            },
            FASTEST: {
                price: numbro(getNetworkInfo.fastest).divide(10).value(),
                wait: numbro(blockTime).multiply(getNetworkInfo.fastestWait).value()
            }
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
            },
            FASTEST: {
                price: 42,
                wait: 0
            }
        }
    }
    
}