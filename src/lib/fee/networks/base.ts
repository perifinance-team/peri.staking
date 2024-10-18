
export const base = async (networkId):Promise<string> => {
    try {
        const gasPrice = await estimateGasPice(networkId, "standard");
        return gasPrice.toString();
    } catch (e) {
        return '0.1';
    }
}

export const baseSepolia = async (networkId):Promise<string> => {
	return '0.0003';
}

export const estimateGasPice = async (network, priority) => {
	const Auth = Buffer.from(
		process.env.REACT_APP_INFURA_API_KEY + ':' + process.env.REACT_APP_INFURA_API_SECRET_KEY
	).toString('base64');

	const gasStationUrl = `https://gas.api.infura.io/networks/${network}/suggestedGasFees`;

	const { high, medium, low } = await fetch(gasStationUrl, {
			headers: { Authorization: `Basic ${Auth}` },
		}).then(response => response.json());

		console.log("medium", medium);
	var gasPrice = 0;
	switch (priority) {
		case 'fast':
			gasPrice =
				Number(high.suggestedMaxFeePerGas) + Number(high.suggestedMaxPriorityFeePerGas);
			break;
		case 'standard':
			gasPrice =
			Number(medium.suggestedMaxFeePerGas) + Number(medium.suggestedMaxPriorityFeePerGas);
			break;
		default:
			gasPrice =
			Number(low.suggestedMaxFeePerGas) + Number(low.suggestedMaxPriorityFeePerGas);
	}
	console.log("gasPrice", gasPrice);
	return gasPrice;
}