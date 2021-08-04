import { contracts } from 'lib/contract'
    
export const getIssuanceRatio = async () => {
    const {
        SystemSettings,
	} = contracts as any;

    return BigInt((await SystemSettings.issuanceRatio()).toString());
};