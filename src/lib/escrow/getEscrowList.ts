import { Contract } from "ethers";

import { formatCurrency } from "lib/format";

export const getEscrowList = async (RewardEscrowV2: Contract, address: string) => {
	const escrowList = [];
	const entry = await RewardEscrowV2.numVestingEntries(address);
	const entryIDs = await RewardEscrowV2.getAccountVestingEntryIDs(address, 0, entry);

	await Promise.all(
		entryIDs.map(async (entry: object, idx: number) => {
			await RewardEscrowV2.vestingSchedules(address, entry).then((data: object[]) => {
				if (formatCurrency(data[1]) === 0) {
					return;
				}

				const endDate = new Date(parseInt(data[0]["_hex"], 16) * 1000);
				const toggle = new Date().getTime() < parseInt(data[0]["_hex"], 16) * 1000;

				escrowList[idx] = {
					amount: formatCurrency(data[1]),
					endTime: `${endDate.getDate() + 1} / ${
						endDate.getMonth() + 1
					} / ${endDate.getFullYear()}`,
					id: entry,
					toggle: !toggle,
				};
			});
		})
	);

	return escrowList.filter((item) => item.amount !== "0");
};
