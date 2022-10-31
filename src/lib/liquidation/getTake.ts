import { utils } from "ethers";
import { setLoading } from "config/reducers/loading";
import { updateTransaction } from "config/reducers/transaction";

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
	dispatch(setLoading({ name: "balance", value: true }));

	if (!value) return;

	if (address === list[id].address) {
		if (balance.pUSD.transferable < BigInt(utils.parseEther(value.replaceAll(",", "")).toString())) return;

		await getState(BigInt(utils.parseEther(value.replaceAll(",", "")).toString()), id, contracts, list, dispatch, toggleModal);
	}
	await toggleModal(id);
	dispatch(setLoading({ name: "balance", value: false }));
};

const getState = async (pUSD: any, id: number, contracts: any, list: any, dispatch: any, toggleModal: any) => {
	try {
		const transaction = await contracts.signers.PeriFinance.liquidateDelinquentAccount(list[id].address, BigInt(pUSD.toString()));
		dispatch(
			updateTransaction({
				hash: transaction.hash,
				message: `Get take`,
				type: "Get take",
			})
		);
	} catch (e) {
		console.error("take ERROR:", e);
	}
};
