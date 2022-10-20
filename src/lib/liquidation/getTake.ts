import { utils } from "ethers";
import { setLoading } from "config/reducers/loading";
import { updateTransaction } from "config/reducers/transaction";
import { formatCurrency } from "lib/format";

export const getTake = async (
	value: string,
	id: number,
	address: string,
	list: any,
	dispatch: any,
	contracts: any,
	balance: any
) => {
	// todo test
	console.log("OTHER PARAMETERS", value, id, address, list);

	if (!value) return;

	if (address !== list[id].address) {
		// dispatch(setLoading({ name: "liquidation", value: true })); // ! temp close

		console.log("TEST", utils.parseEther(value), value, value < balance.pUSD.transferable, value > balance.pUSD.transferable);
		if (balance.pUSD.transferable < utils.parseEther(value)) return;

		// getState(utils.parseEther(value), id, contracts, list, dispatch); // ! make this
	}
};

const getState = async (pUSD: any, id: number, contracts: any, list: any, dispatch: any) => {
	try {
		const transaction = await contracts.signers.PeriFinance.liquidateDelinquentAccount(
			list[id].address,
			// BigInt(sumCollateral)
			BigInt(pUSD)
		);

		await contracts.provider.once(transaction.hash, async (state) => {
			if (state.status === 1) {
				dispatch(
					updateTransaction({
						hash: transaction.hash,
						message: `Get take`,
						type: "Get take",
					})
				);
				dispatch(setLoading({ name: "liquidation", value: false }));
			}
		});
	} catch (e) {
		console.log("take err", e);
		dispatch(setLoading({ name: "liquidation", value: false }));
	}
};
