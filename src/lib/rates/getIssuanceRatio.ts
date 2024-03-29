import { contracts } from 'lib/contract'
    
export const getIssuanceRatio = async (currentWallet) => {
    const {
        // SystemSettings,
        Issuer,
	} = contracts as any;

    // const issuanceRatio = await SystemSettings?.issuanceRatio();
    const targetRatio = await Issuer.getTargetRatio();

    return BigInt((Issuer? targetRatio : 25e17));
};