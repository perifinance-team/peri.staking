import { BigNumber, Contract } from 'ethers';

import { contracts } from 'lib/contract';
import ERC20 from 'lib/contract/abi/ERC20.json';

const tokenAddress = {
    1: '0x3530A9461788891b7f5b94148a6E82FFa6fd236a',
    42: '0x57ed66ca0e67a97e217e617b1ba6b75e87db118d',
    97: '0xB28a19ec5a6f4269f47a486f467690Bd3376D203',
    56: '0xb68ebcec4c7aba66f5b8ed62e8c98b269cf918c8',
    137: '0x98f675b60769abc732ee59685bffa19ea3c8e81c',
    80001: '0x1357a050b0895535A173B0aaD97d1A2DEC48398B',   
}

export const getExchangeRatesLP = async (networkId) => {
    const PERI_ADDRESS = contracts.PeriFinance.address;

    const provider = contracts.provider;
    const peri = new Contract(PERI_ADDRESS, ERC20.abi, provider);
    const lp = tokenAddress[networkId] 
        ? new Contract(tokenAddress[networkId], ERC20.abi, provider)
        : undefined;

    const [PERIBalance, PoolTotal] = await Promise.all([
        tokenAddress[networkId] ? peri.balanceOf(tokenAddress[networkId]) : BigNumber.from(0),
        lp ? lp.totalSupply() : BigNumber.from(0),
    ]);

    // const PERIBalance = BigInt((await peri.balanceOf(tokenAddress[networkId])).toString());
    // const PoolTotal = BigInt((await lp.totalSupply()).toString());
    
    const periPerLP:{
        PERIBalance: bigint,
        PoolTotal: bigint
    } = { PERIBalance: PERIBalance.toBigInt(), PoolTotal: PoolTotal.toBigInt()};
    
    return periPerLP;
}