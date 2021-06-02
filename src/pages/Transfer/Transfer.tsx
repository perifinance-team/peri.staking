import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components'

import { RootState } from 'config/reducers'

import { pynthetix, formatCurrency } from 'lib'

import Action from 'screens/Action'
import { utils } from 'ethers'
import numbro from 'numbro'

import { ActionContainer } from 'components/Container'
import { BlueGreenButton } from 'components/Button'
import { H4, H5 } from 'components/Text'
import Fee from 'components/Fee'
import Input from 'components/Input'


const Transfer = () => {
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const balances = useSelector((state: RootState) => state.balances.balances);
    const [transferData, setTransferData] = useState({});
    const [transferAmount, setTransferAmount] = useState<string>("0");
    const [gasLimit, setGasLimit] = useState<number>(0);
    
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
            const issuanceRatio = utils.formatEther(await Issuer.issuanceRatio());
            const exchangeRates = utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes.PERI));
            // RewardEscrow.totalEscrowedAccountBalance(currentWallet),
            // PeriFinanceEscrow.balanceOf(currentWallet),
            // const maxIssuable = PeriFinance.maxIssuablePynths(currentWallet),
            const PERIBalance = utils.formatEther(await PeriFinance.balanceOf(currentWallet));
            setTransferData({
                balanceOf,
                pUSDBalance,
                issuanceRatio,
                exchangeRates,
                PERIBalance,
            });
        }
        init();
    }, []);

    const getGasEstimate = async (amount) => {
        try {
            let estimateGasLimit = await PeriFinance.contract.estimate.burnSynths(amount);
            setGasLimit(numbro(estimateGasLimit).multiply(1.2).value());
        } catch (e) {
            console.log(e);
        }
    }

    // const setCurrencyChage = (event) => {
    //     let value = event.target.value;

    //     if(numbro(burnData.pUSDBalance).subtract(numbro(value).value()).value() < 0 ) {
    //         value = burnData.pUSDBalance;
    //     }

    //     getGasEstimate(burningAmount);
    // }

    // const setTransferAmount = (event) => {
    //     let value = event.target.value;

    //     if(numbro(burnData.pUSDBalance).subtract(numbro(value).value()).value() < 0 ) {
    //         value = burnData.pUSDBalance;
    //     }

    //     getGasEstimate(burningAmount);
    // }

    

    // const setAmountMax = () => {
    //     setCurrency(formatCurrency(burnData.pUSDBalance))
    // }
    
    return (
        <Action title="TRANSFER"
            subTitles={[
                "Transfer your ETH, PERI or Pynths.",
            ]}
             
        >
            <ActionContainer>
                <div>
                    <Input key="primary"
                        currencyName="pUSD"
                        currencies={balances}
                        value={transferAmount}
                        onChange={setTransferAmount}
                        onBlur={() => formatCurrency(transferAmount)}
                        maxAction={() => {}}
                    />
                </div>
                <div>
                    <BurnButton onClick={ () => console.log(12)}><H4 weigth="bold">BURN</H4></BurnButton>
                    <Fee gasPrice={seletedFee.price}/>
                </div>
            </ActionContainer>
        </Action>
    );
}

const BurnButton = styled(BlueGreenButton)`
    width: 100%;
    height: 50px;
`

export default Transfer;