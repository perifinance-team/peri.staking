import { ca } from 'date-fns/locale';
import { contracts } from 'lib/contract'
    
export const getIssuanceRatio = async (currentWallet) => {
    const {
        // SystemSettings,
        Issuer,
	} = contracts as any;

    // console.log("calling getRatios")
    let ratios;
    try {
        ratios = await Issuer.getRatios(currentWallet, true);
    } catch (e) {
        console.log(e);
        ratios = await Issuer.getRatios(currentWallet, false);
    }

    const {tRatio, cRatio, exSR, maxSR} = ratios;

    // console.log("called getRatios")
    return { tRatio: tRatio ? tRatio : 25e17, cRatio, exSR, maxSR };
};