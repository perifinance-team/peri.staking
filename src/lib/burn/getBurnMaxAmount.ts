import { getBurnTransferAmount } from 'lib'

import numbro from 'numbro';

export const getBurnMaxAmount = ({ balances }) => {
    let pUSD;
    if (numbro(balances['debt']).value() > numbro(balances['pUSD']).value()) {
        pUSD = balances['pUSD'];
    } else {
        pUSD = balances['debt'];
    }
    
    const USDC = '0.000000';
    
    return {
        pUSD,
        USDC,
    }
}