import { Contract } from "ethers";

import { formatCurrency } from "lib/format";

export const getEscrowList = async (RewardEscrowV2: Contract, address: string) => {
	const escrowList = [];
	const entry = await RewardEscrowV2.numVestingEntries(address);
	const schedules = await RewardEscrowV2.getVestingSchedules(address, 0, entry);

	await Promise.all(
		schedules.map( async (data:any, idx: number) => {
			try {
				
				const endDate = new Date(parseInt(data.endTime["_hex"], 16) * 1000);
				const toggle = new Date().getTime() < endDate.getTime();

				escrowList[idx] = {
					amount: formatCurrency(data.escrowAmount),
					endTime: `${endDate.getDate() + 1} / ${
						endDate.getMonth() + 1
					} / ${endDate.getFullYear()}`,
					id: data.entryID,
					toggle: !toggle,
				};
			}
			catch(e) {
				console.log("get vestingSchedules error", e);
				return {amount: "0", endTime: "", id: entry, toggle: false};
			}
		})
	);

	console.log("escrowList", escrowList);

	return escrowList.filter((item) => item.amount !== "0");
};
