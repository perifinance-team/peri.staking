import { contracts } from 'lib/contract'
    
export const getIssuanceRatio = async () => {
    const {
        SystemSettings,
	} = contracts as any;

    const issuanceRatio = await SystemSettings?.issuanceRatio();

    return BigInt((SystemSettings? issuanceRatio : 25e17));
};