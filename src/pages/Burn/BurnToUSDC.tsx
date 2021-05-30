import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components'

import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'

import { getBurnData, BurnData, getBurnTransferAmount, getBurnMaxUSDCAmount, getBurnMaxAmount, getBurnEstimateCRatio } from 'lib'

import Action from 'screens/Action'
import numbro from 'numbro'

import BurnActionButtons from './BurnActionButtons'
import { LightBlueButton } from 'components/Button'
import { ActionContainer } from 'components/Container'
import { H5 } from 'components/Text'

import Fee from 'components/Fee'
import Input from 'components/Input'
import { gasPrice } from 'helpers/gasPrice'

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
    const [burningAmount, setBurningAmount] = useState<AmountsString>({pUSD: '0', USDC: '0', PERI: '0'});
    const [estimateCRatio, setEstimateCRatio] = useState<string>("0");
    const [maxBurningAmount, setMaxBurningAmount] = useState<AmountsString>(
        {pUSD: '0', USDC: '0', PERI: '0'}
    );

    const [transferAmount, setTransferAmount] = useState<string>("0");
    // eslint-disable-next-line
    const [gasLimit, setGasLimit] = useState<number>(0);

    useEffect(() => {
        const init = async() => {
            dispatch(setIsLoading(true));
            try {
                const data = await getBurnData(currentWallet);
                setBurnData(data);
                const maxAmount = getBurnMaxAmount({...data, type: 'USDC'});
                setMaxBurningAmount(maxAmount);
                setEstimateCRatio(getBurnEstimateCRatio({
                    balances: data.balances,
                    exchangeRates: data.exchangeRates, 
                    burningAmount
                }));
            } catch(e) {
                console.log(e)
            }
            dispatch(setIsLoading(false));
        }
        init();
        // eslint-disable-next-line
    }, [currentWallet]);

    const setBurningAmountChange = (value) => {
        value = value.replace(/\,/g, '');

        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,6}/g)[0];
        }
        
        if(isNaN(Number(value)) || value === "") {
            setBurningAmount({
                pUSD: '',
                USDC: '0.000000',
                PERI: '0.000000',
            });
            return false;
        }
            
        if(numbro(maxBurningAmount['pUSD']).clone().subtract(numbro(value).value()).value() < 0 ) {
            value = maxBurningAmount['pUSD'];
        }
        
        const USDCtransferTopUSD = getBurnTransferAmount({
            amount: burningAmount['USDC'],
            issuanceRatio: burnData.issuanceRatio,
            exchangeRates: burnData.exchangeRates,
            target: 'USDC'
        }); 
        
        let subtractUSDCAmount = numbro(value).add(numbro(USDCtransferTopUSD).value());
        
        const pUSDtransferToPERI = getBurnTransferAmount({
            amount: subtractUSDCAmount,
            issuanceRatio: burnData.issuanceRatio, 
            exchangeRates: burnData.exchangeRates,
            target: 'pUSD'
        });

        const maxBurningUSDCAmount = getBurnMaxUSDCAmount({
            issuanceRatio: burnData.issuanceRatio,
            exchangeRates: burnData.exchangeRates,
            burningAmount: value,
            stakedUSDC: burnData.staked['USDC'],
        })


        setMaxBurningAmount({
            pUSD: maxBurningAmount['pUSD'],
            USDC: maxBurningUSDCAmount
        })

        setEstimateCRatio(getBurnEstimateCRatio({
            balances: burnData.balances,
            exchangeRates: burnData.exchangeRates, 
            burningAmount: {
                pUSD: value,
                USDC: maxBurningUSDCAmount,    
            }
        }));

        setBurningAmount({
            pUSD: value,
            USDC: maxBurningUSDCAmount,
        });
            
        
        //todo: escrow add to fiexed
        // getGasEstimate();
    }

    const setBurningUSDCAmountChange = (value) => {
        value = value.replace(/\,/g, '');

        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,6}/g)[0];
        }
        
        if(isNaN(Number(value)) || value === "") {
            value = '';
        }
        
        if(numbro(maxBurningAmount['USDC']).clone().subtract(numbro(value).value()).value() < 0 ) {
            value = numbro(maxBurningAmount['USDC']).clone();    
        }
        
        const USDCtransferTopUSD = getBurnTransferAmount({
            amount: value, 
            issuanceRatio: burnData.issuanceRatio,
            exchangeRates: burnData.exchangeRates,
            target: 'USDC'
        });
        
        let subtractUSDCAmount = numbro(burningAmount['pUSD']).subtract(numbro(USDCtransferTopUSD).value());
        
        const pUSDtransferToPERI = getBurnTransferAmount({
            amount: subtractUSDCAmount,
            issuanceRatio: burnData.issuanceRatio, 
            exchangeRates: burnData.exchangeRates,
            target: 'pUSD'
        });

        setEstimateCRatio(getBurnEstimateCRatio({
            balances: burnData.balances,
            exchangeRates: burnData.exchangeRates, 
            burningAmount: {
                pUSD: burningAmount['pUSD'],
                USDC: value,    
            }
        }));
        
        setBurningAmount({
            pUSD: burningAmount['pUSD'],
            USDC: value,
        });
}
    

    const setAmountpUSDMax = () => {
        setBurningAmountChange(maxBurningAmount['pUSD']);
    }

    const setAmountUSDCMax = () => {
        setBurningUSDCAmountChange(maxBurningAmount['USDC']);
    }

    return (
        <ActionContainer>
            <div>
                <BurnInfoContainer>
                    <H5>Estimated C-Ratio: {estimateCRatio}%</H5>
                </BurnInfoContainer>

                <Input key="primary"
                    currencyName="pUSD"
                    value={burningAmount['pUSD']}
                    onChange={event => setBurningAmountChange(event.target.value)}
                    maxAction={() => setAmountpUSDMax()}
                    maxAmount={maxBurningAmount['pUSD']}
                    
                />
                <Input key="usdc"
                    currencyName="USDC"
                    value={maxBurningAmount['USDC']}
                    disabled={true}  
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
    );
}

const BurnInfoContainer = styled.div`
    padding: 0 10px;
    H5 {
       text-align: right;
    }
`
export default Burn;