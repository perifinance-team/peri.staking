import { contracts } from 'lib/contract'

export const getVestable = async (currentWallet) => {
    const {
        PeriFinanceEscrow,
	} = contracts as any;
    console.log()

    return (await PeriFinanceEscrow.numVestingEntries(currentWallet)).toNumber() > 0;
}