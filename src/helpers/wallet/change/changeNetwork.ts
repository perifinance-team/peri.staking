type OnEvent = void | undefined;

let onEvent: OnEvent;

export const changeNetwork = () => {
    if (!window.ethereum || onEvent) return;
    let timer;
    // @ts-ignore
    onEvent = window.ethereum.on('chainChanged', () => {
        if (!timer) {
            timer = setTimeout(function() {
                window.location.reload();
              timer = null;
            }, 1000);
          }
        
    });
}
