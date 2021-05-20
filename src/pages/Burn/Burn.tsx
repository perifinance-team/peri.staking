import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components'

import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'

import { pynthetix, getCurrencyFormat, getBurnData, BurnData, getBurnTransferAmount, getBurnMaxAmount } from 'lib'

import Action from 'screens/Action'
import { utils } from 'ethers'
import numbro from 'numbro'

import BurnActionButtons from './BurnActionButtons'
import { LightBlueButton } from 'components/Button'
import { ActionContainer } from 'components/Container'
import { H5 } from 'components/Text'

import Fee from 'components/Fee'
import Input from 'components/Input'
import { gasPrice } from 'helpers/gasPrice'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

type AmountsNumbro = {
    PERI?: numbro.Numbro,
    USDC?: numbro.Numbro,
    pUSD?: numbro.Numbro,
}

type AmountsString = {
    PERI?: string,
    USDC?: string,
    pUSD?: string,
}

const Burn = () => {
    const dispatch = useDispatch();
    
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const [burnData, setBurnData] = useState<BurnData>();
    const [burningAmount, setBurningAmount] = useState<AmountsString>({pUSD: '', USDC: '', PERI: ''})
    const [maxBurningAmount, setMaxBurningAmount] = useState<AmountsNumbro>();

    const [transferAmount, setTransferAmount] = useState<string>("0");
    const [gasLimit, setGasLimit] = useState<number>(0);
    
    const [useBurningUSDC, setUseBurningUSDC] = useState<boolean>(false);

    const { js: {PeriFinance} } = pynthetix as any;

    useEffect(() => {
        const init = async() => {
            dispatch(setIsLoading(true));
            try {
                const data = await getBurnData(currentWallet);
                setBurnData(data);
                const MaxAmount = getBurnMaxAmount({...data});
                setMaxBurningAmount(MaxAmount);
            } catch(e) {
                console.log(e)
            }
            dispatch(setIsLoading(false));
        }
        init();
        
    }, []);

    const setBurningAmountChange = (value) => {
        let amount:numbro.Numbro = !isNaN(Number(value)) && value ? numbro(value) : numbro(0);
        let USDCAmount:numbro.Numbro = !isNaN(Number(burningAmount['USDC'])) && burningAmount['USDC'] ? numbro(burningAmount['USDC']) : numbro(0);
        let subtractUSDCAmount:numbro.Numbro = numbro(0);
        try {
            if(maxBurningAmount['pUSD'].clone().subtract(amount.value()).value() < 0 ) {
                amount = maxBurningAmount['pUSD'].clone();
            }
            
            const USDCtransferTopUSD = getBurnTransferAmount({
                amount: useBurningUSDC ? USDCAmount : '0', 
                issuanceRatio: burnData.issuanceRatio,
                exchangeRates: burnData.exchangeRates,
                target: 'USDC'
            });

            if(useBurningUSDC) {
                subtractUSDCAmount = amount.clone().add(USDCtransferTopUSD.value());
            }
            
            const pUSDtransferToPERI = getBurnTransferAmount({
                amount: useBurningUSDC ? subtractUSDCAmount : amount, 
                issuanceRatio: burnData.issuanceRatio, 
                exchangeRates: burnData.exchangeRates,
                target: 'pUSD'
            });
            
            setBurningAmount({
                pUSD: value,
                USDC: burningAmount['USDC'],
                PERI: getCurrencyFormat(pUSDtransferToPERI.value().toString())
            });
            
        }
        catch(e) {
            
        }
        //todo: escrow add to fiexed
        // getGasEstimate();
    }

    const setBurningUSDCAmountChange = (value) => {
        
        let amount:numbro.Numbro = !isNaN(Number(value)) && value ? numbro(value) : numbro(0);
        
        let pUSDAmount:numbro.Numbro = !isNaN(Number(burningAmount['pUSD'])) && burningAmount['pUSD'] ? numbro(burningAmount['pUSD']) : numbro(0);

        let subtractUSDCAmount:numbro.Numbro = numbro(0);
        try {
            if(maxBurningAmount['USDC'].clone().subtract(amount.value()).value() < 0 ) {
                amount = maxBurningAmount['USDC'].clone();
            }

            const USDCtransferTopUSD = getBurnTransferAmount({
                amount: useBurningUSDC ? amount : '0', 
                issuanceRatio: burnData.issuanceRatio,
                exchangeRates: burnData.exchangeRates,
                target: 'USDC'
            });
            
            if(useBurningUSDC) {
                subtractUSDCAmount = numbro(pUSDAmount).clone().add(USDCtransferTopUSD.value());
            }

            const pUSDtransferToPERI = getBurnTransferAmount({
                amount: useBurningUSDC ? subtractUSDCAmount : amount, 
                issuanceRatio: burnData.issuanceRatio, 
                exchangeRates: burnData.exchangeRates,
                target: 'pUSD'
            });

            setBurningAmount({
                pUSD: burningAmount['pUSD'],
                USDC: value,
                PERI: getCurrencyFormat(pUSDtransferToPERI.value().toString())
            });

        }
        catch(e) {
        }   
    }


    // const setTransferAmountChange = (value) => {
    //     let amount:numbro.Numbro = numbro(value);

    //     let subtractUSDCAmount:numbro.Numbro = numbro(0);

    //     try {
    //         if(maxBurningAmount['pUSD'].clone().subtract(amount.value()).value() < 0 ) {
    //             amount = maxBurningAmount['pUSD'].clone();
    //         }
    //         // setTransferAmount();
    //         const BurningAmount = amount.multiply(numbro(burnData.issuanceRatio).value()).multiply(numbro(burnData.exchangeRates['PERI']).value()).value();
    //         setBurningAmount(amount.value() > 0 ? getCurrencyFormat(BurningAmount) : 0)
    //     }
    //     catch(e) {
    //         // setTransferAmount("0");
    //         // setBurningAmount("0");
    //     }
        
    // }

    

    

    const setAmountpUSDMax = () => {
        // setBurningAmount(getCurrencyFormat(maxBurningAmount.value()));
        // setTransferAmount(getCurrencyFormat(maxBurningAmount['PERI'].value()));
        //USDC 계산
    }

    const setAmountUSDCMax = () => {
        // setBurningUSDCAmount(getCurrencyFormat(maxBurningUSDCAmount.value()));
        // let burnAmount;
        // if(numbro(burningAmount).value() === 0) {
        //     burnAmount = numbro(maxBurningUSDCAmount).multiply(numbro(burnData.exchangeRates['USDC']).value()).add(numbro(burningAmount).value());
        // } else {
        //     burnAmount = numbro(maxBurningUSDCAmount).multiply(numbro(burnData.exchangeRates['USDC']).value()).add()
        // }
        
        // setBurningAmount(getCurrencyFormat(burnAmount.value()));
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
                    <UseUSDCButton onClick={() => setUseBurningUSDC(!useBurningUSDC)}>
                        <H5 color={'red'}>{useBurningUSDC ? 'disable USDC' : 'use USDC'}</H5>
                    </UseUSDCButton>
                
                    <Input key="primary"
                        currencyName="pUSD"
                        value={burningAmount.pUSD}
                        onChange={event => setBurningAmountChange(event.target.value)}
                        onBlur={() => setBurningAmount({pUSD: getCurrencyFormat(burningAmount['pUSD'])})}
                        maxAction={() => setAmountpUSDMax()}
                    />
                    {useBurningUSDC && <Input key="usdc"
                        currencyName="USDC"
                        value={burningAmount.USDC}
                        onChange={event => setBurningUSDCAmountChange(event.target.value)}
                        maxAction={() => setAmountUSDCMax()}
                    />}
                    <Input key="secondary"
                        currencyName="PERI"
                        value={burningAmount.PERI}
                        disabled={true}  
                        onBlur={() => setTransferAmount(getCurrencyFormat(transferAmount))}
                    />
                </div>
                <div>
                    <BurnActionButtons 
                        burnData={burnData}
                        burningAmount={burningAmount} 
                        gasPrice={gasPrice(seletedFee.price)} 
                        />
                    
                    
                    
                    <Fee gasPrice={seletedFee.price} gasLimit={gasLimit}/>
                </div>
            </ActionContainer>
        </Action>
    );
}

const UseUSDCButton = styled(LightBlueButton)`
    height: 30px;
    padding: 0px 20px;
    width: fit-content;
`

export default Burn;