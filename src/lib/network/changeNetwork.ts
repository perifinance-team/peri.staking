import { networkInfo } from "configure/networkInfo";
import { NotificationManager } from "react-notifications";
import { web3Onboard } from "lib/onboard";
// import { ca } from "date-fns/locale";
import { providers } from "ethers";

export const changeNetwork = async (chainId:any) => {
    let provider = null;
    try {
        if (isNaN(chainId) || chainId == null) return;

        const [primaryWallet] = web3Onboard.onboard.state.get().wallets;
        provider = new providers.Web3Provider(primaryWallet.provider, "any");
        // @ts-ignore
        await (provider.provider as any)?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: networkInfo[chainId].chainId }],
        });
    } catch (switchError) {
        
        console.log(switchError);
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === -32002 && !switchError.message.includes("pending")) {
            NotificationManager.warning(`Please add the required networks to your wallet first.`);
        }
        // handle other "switch" errors
    }

    provider = null;
};
