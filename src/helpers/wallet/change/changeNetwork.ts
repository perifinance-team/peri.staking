import { utils } from 'ethers';

type OnEvent = void | undefined;

let onEvent: OnEvent;

export const changeNetwork = (action) => {
    if (!window.ethereum || onEvent) return;
    let timer;
    // @ts-ignore
    onEvent = window.ethereum.on('chainChanged', (chainId) => {
        if (!timer) {
            timer = setTimeout(function() {
                action(utils.bigNumberify(chainId).toNumber());
                window.location.reload();
                timer = null;
            }, 1000);
        }
    });
}
