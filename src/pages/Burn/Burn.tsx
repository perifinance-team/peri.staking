import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

import { RootState } from 'config/reducers'

import { pynthetix, getCurrencyFormat } from 'lib'

import Action from 'screens/Action'
import { utils } from 'ethers'
import numbro from 'numbro'
import { updateTransaction } from 'config/reducers/transaction'

import BurnActionButtons from './BurnActionButtons'
import { ActionContainer } from 'components/Container'

import Fee from 'components/Fee'
import Input from 'components/Input'

const Burn = () => {
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const [burnData, setBurnData] = useState({
        balanceOf: '0',
        pUSDBalance: '0',
        issuanceRatio: '0',
        exchangeRates: '0',
        PERIBalance: '0',
    });
    const [burningAmount, setBurningAmount] = useState<string>("0");
    const [transferAmount, setTransferAmount] = useState<string>("0");
    const [gasLimit, setGasLimit] = useState<number>(0);
    const [maxBurningAmount, setMaxBurningAmount] = useState<numbro.Numbro>(numbro(0));
    const [maxTransferAmount, setMaxTransferAmount] = useState<numbro.Numbro>(numbro(0));
    const { js: {PeriFinance, pUSD, Issuer, ExchangeRates} } = pynthetix as any;

    const currenciesToBytes = {
        PERI: utils.formatBytes32String('PERI'),
        pUSD: utils.formatBytes32String('pUSD'),
        USDC: utils.formatBytes32String('USDC')
    }
    
    useEffect(() => {
        const init = async() => {
            const balanceOf = utils.formatEther(await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes.pUSD));
            const pUSDBalance = utils.formatEther(await pUSD.balanceOf(currentWallet));
            console.log(pUSDBalance)
            const issuanceRatio = utils.formatEther(await Issuer.issuanceRatio());
            const exchangeRates = utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes.PERI));
            // RewardEscrow.totalEscrowedAccountBalance(currentWallet),
            // PeriFinanceEscrow.balanceOf(currentWallet),
            // const maxIssuable = PeriFinance.maxIssuablePynths(currentWallet),
            const PERIBalance = utils.formatEther(await PeriFinance.balanceOf(currentWallet));
            setBurnData({
                balanceOf,
                pUSDBalance,
                issuanceRatio,
                exchangeRates,
                PERIBalance,
            });
            
            if(Number(pUSDBalance) > 0) {
                setMaxBurningAmount(numbro(pUSDBalance));
                setMaxTransferAmount(numbro(pUSDBalance).divide(numbro(burnData.issuanceRatio).value()).divide(numbro(burnData.exchangeRates).value()));
            }
        }
        init();
    }, []);

    const getGasEstimate = async (amount) => {
        let estimateGasLimit;
        try {
            estimateGasLimit = await PeriFinance.contract.estimate.burnSynths(amount);
        } catch (e) {
            estimateGasLimit = 32000;
            console.log(e);
        }
        setGasLimit(numbro(estimateGasLimit).multiply(1.2).value());
    }

    const setBurningAmountChage = (value) => {
        value = numbro(value);
        if(maxBurningAmount.clone().subtract(value.value()).value() < 0 ) {
            value = maxBurningAmount.clone();
        }
        setBurningAmount(value.value());
        const TransferAmount = value.divide(numbro(burnData.issuanceRatio).value()).divide(numbro(burnData.exchangeRates).value()).value()
        setTransferAmount(value.value() > 0 ? getCurrencyFormat(TransferAmount) : 0)
        //todo: escrow add to fiexed
    }

    const setTransferAmountChage = (value) => {
        value = numbro(value);
        if(maxTransferAmount.clone().subtract(value.value()).value() < 0 ) {
            value = maxTransferAmount.clone();
        }
        setTransferAmount(value.value());
        const BurningAmount = value.multiply(numbro(burnData.issuanceRatio)).multiply(numbro(burnData.exchangeRates).value()).value();
        setBurningAmount(value.value() > 0 ? getCurrencyFormat(BurningAmount) : 0)
        
    }

    const setAmountMax = () => {
        setBurningAmount(getCurrencyFormat(maxBurningAmount.value()));
        console.log(maxTransferAmount)
        setTransferAmount(getCurrencyFormat(maxTransferAmount.value()));
    }

    return (
        <Action title="BURN"
            subTitles={[
                "If you have staked your PERI and minted pUSD, you are eligible to collect two kinds of rewards :",
                "allowing you to transfer your non-escrowed PERI."
            ]}
             
        >
            <ActionContainer>
                <div>
                    <Input key="primary"
                        currencyName="pUSD"
                        value={burningAmount}
                        onChange={event => setBurningAmountChage(event.target.value)}
                        onBlur={() => setBurningAmount(getCurrencyFormat(burningAmount))}
                        maxAction={() => setAmountMax()}
                    />
                    <Input key="secondary"
                        currencyName="PERI"
                        value={transferAmount}
                        onChange={event => setTransferAmountChage(event.target.value)}
                        onBlur={() => setBurningAmount(getCurrencyFormat(transferAmount))}
                        maxAction={() => setAmountMax()}
                    />
                </div>
                <div>
                    <BurnActionButtons burningAmount={burningAmount} gasPrice={seletedFee.price} gasLimit={gasLimit} ></BurnActionButtons>
                    <Fee gasPrice={seletedFee.price} gasLimit={gasLimit}/>
                </div>
            </ActionContainer>
        </Action>
    );
}



export default Burn;