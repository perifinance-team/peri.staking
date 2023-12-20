export const polygon = async ():Promise<bigint> => {
    try {
        const getNetworkInfo = await fetch(`https://gasstation.polygon.technology/v2`).then(response => response.json());
        return BigInt(Math.floor(getNetworkInfo.standard.maxFee));
    } catch (e) {
        return BigInt(25n);
    }
}

