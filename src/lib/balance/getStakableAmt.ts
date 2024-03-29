import { multiplyDecimal, divideDecimal } from "../utils";
import { contracts } from "lib/contract";
import { utils } from "ethers";

const stables = ['USDC', 'USDT', 'DAI'];

export const getStakableAmt = async (tokenIR:bigint, otherIR:bigint, tokenEA:bigint, otherEA:bigint, totalEA:bigint, periIR:bigint, maxSR:bigint) => {
	// get target token's stakable amount  getExternalTokenQuota() = Tmax
	// X = [ ( Tmax - Tp ) * V - { ( Tt - Tp ) * Vt + ( To - Tp ) * Vo } ] / ( Tt - Tmax )
	// addableAmt = ( Tt - Tp ) * Vt : always Tt > Tp
	let temp = tokenIR - periIR;
	let addableAmt = multiplyDecimal(temp, tokenEA);

	// addableAmt = addableAmt + ( To - Tp ) * Vo : always To > Tp
	temp = multiplyDecimal(otherIR > 0 ? otherIR - periIR : 0, otherEA);
	addableAmt = addableAmt + temp;

	// temp = ( Tmax - Tp ) * V : always Tmax > Tp
	temp = maxSR - periIR;
	temp = multiplyDecimal(temp, totalEA);

	// if target token's EA > target token's SA, return (old exTRatio, 0)
	if (temp < addableAmt) {
		return 0;
	}

	// addableAmt = ( Tmax - Tp ) * V - addableAmt
	addableAmt = temp - addableAmt;

	// addableAmt = addableAmt / ( Tt - Tmax )
	temp = tokenIR - maxSR;
	addableAmt = divideDecimal(addableAmt, temp);
}

export const getDebtNAddableAmt = async (tokens:any, periIR:bigint, cRatio:bigint) => {
	let stableEA:bigint, goldEA:bigint;
	
	const maxSR = await contracts.SystemSettings.externalTokenQuota();
	const stableIR = await contracts.SystemSettings.exTokenIssuanceRatio(utils.formatBytes32String("USDC"));
	const goldIR = await contracts.SystemSettings.exTokenIssuanceRatio(utils.formatBytes32String("XAUT"));
	const debts = {...tokens["DEBT"]};
	Object.keys(tokens).forEach((token) => {
		if (stables.includes(token)) {
			stableEA = tokens[token].staked;
			debts[token] = multiplyDecimal(tokens[token].staked, stableIR);
		} else {
			goldEA = tokens[token].staked;
			debts[token] = multiplyDecimal(tokens[token].staked, goldIR);
		}
		debts["exDebt"] = debts["exDebt"] + debts[token];
		tokens[token].stakableAmt = tokens[token].balance;
	});
	const totalEA = stableEA + goldEA;
	tokens["DEBT"] = debts;

	if (cRatio === 0n) return;

	Object.keys(tokens).forEach((token) => {
		let tokenIR, otherIR, tokenEA, otherEA;
		if (stables.includes(token)) {
			tokenIR = stableIR;
			otherIR = goldIR;
			tokenEA = stableEA;
			otherEA = goldEA;
			
		} else {
			tokenIR = goldIR;
			otherIR = stableIR;
			tokenEA = goldEA;
			otherEA = stableEA;
		}

		tokens[token].stakableAmt = getStakableAmt(tokenIR, otherIR, tokenEA, otherEA, totalEA, periIR, maxSR);
		tokens[token].stakableAmt = tokens[token].stakableAmt > tokens[token].balance ? tokens[token].balance : tokens[token].stakableAmt;
	});
}
