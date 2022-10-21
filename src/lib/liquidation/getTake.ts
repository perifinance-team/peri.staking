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
	balance: any,
	toggleModal: any
) => {
	// todo test
	console.log("OTHER PARAMETERS", value, id, address, list);

	if (!value) return;

	if (address !== list[id].address) {
		dispatch(setLoading({ name: "liquidation", value: true }));

		console.log(
			"TEST",
			utils.parseEther(value.replaceAll(",", "")),
			value,
			value < balance.pUSD.transferable,
			value > balance.pUSD.transferable
		);
		if (balance.pUSD.transferable < utils.parseEther(value.replaceAll(",", ""))) return;

		getState(utils.parseEther(value.replaceAll(",", "")), id, contracts, list, dispatch, toggleModal); // ! make this
	}
};

const getState = async (pUSD: any, id: number, contracts: any, list: any, dispatch: any, toggleModal: any) => {
	try {
		const transaction = await contracts.signers.PeriFinance.liquidateDelinquentAccount(list[id].address, BigInt(pUSD.toString()));

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
				await toggleModal(id);
			}
		});
	} catch (e) {
		console.log("take err", e);
		dispatch(setLoading({ name: "liquidation", value: false }));
		await toggleModal(id);
	}
};
