
type OnEvent = void | undefined;

let onEvent: OnEvent;

export const changeAccount = (dispatch, clear) => {
  if (!window.ethereum || onEvent) return;
  let timer;
  // @ts-ignore
  onEvent = window.ethereum.on('accountsChanged', (account?: string) => {
      if (!timer) {
        timer = setTimeout(function() {
          if(account.length > 0) {
            dispatch();
          } else {
            clear();
            // window.location.reload();
          }
          timer = null;
        }, 1000);
      }   
    
     
    
  });
}