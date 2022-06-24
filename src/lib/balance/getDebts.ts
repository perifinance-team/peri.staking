import { RPC_URLS } from 'lib/rpcUrl'
import { utils } from 'ethers'
import { providers, Contract } from 'ethers'
import CrossChainABI from '../contract/abi/CrossChainManager.json'
// import PeriFinanceStateABI from '../contract/abi/PeriFinanceState.json'
import PeriFinanceABI from '../contract/abi/PeriFinance.json'

const perifinanceAddress = {
    1: '0x40aF5ea5F929AA4Da758cA362332c32736b40f29',
    56: '0x66bb2a989C5D616e308fE71B7FabF40EFfce9f8b',
    1285: '0x2CC685fc9C1574fE8400548392067eC0B9eA1095',
    137: '0x8B0c4F62265326BbE7470E7577A0FC18C591a1F4'
}

const crossChainManagerAddress = {
    1: '0xc1Ea777ab4F7c7fEb0912C110FB9Ac72612B2478',
    56: '0x1dEf1270bA88150fdaA2061A566265c89765B747',
    1285: '0x079D64Ff54A38398a1C071D705A8e8e2f10573dF',
    137: '0xD7ad896B819d354c5110cBA982466945b0A31d4A'
}

export const getDebts = async (targetAddress) => {

    console.log('networkId, issuedDebt, activeDebt, debt, activeDebt(inpUSD), crossNetworkActiveDebtAll, debtRate('+targetAddress+')');
    for await (let networkId of Object.keys(crossChainManagerAddress)) {
        if(crossChainManagerAddress[networkId]) {
            const provider = new providers.JsonRpcProvider(RPC_URLS[networkId], Number(networkId));
            const contract = new Contract(crossChainManagerAddress[networkId], CrossChainABI.abi, provider);
            const perifinance = new Contract(perifinanceAddress[networkId], PeriFinanceABI.abi, provider);

            let a = await contract.getCurrentNetworkIssuedDebt();
            let b = await contract.getCurrentNetworkActiveDebt();
            let c = await contract.getCurrentNetworkDebt();
            let d = await contract.getCurrentNetworkAdaptedActiveDebtValue(utils.formatBytes32String("pUSD"));
            let e = await contract.getCrossNetworkActiveDebtAll();

            let myDebt = BigInt((await perifinance.debtBalanceOf(targetAddress, utils.formatBytes32String('pUSD'))))
            let myPercent = Number(myDebt*100000n/BigInt(c[0]))/1000;

            console.log(networkId, a.toString(), b.toString(), c[0].toString(), d[0].toString(), e.toString(), myPercent);
        }
    }
}