import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components'

import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'

import { getBurnData, BurnData, getBurnTransferAmount, getBurnMaxUSDCAmount, getBurnMaxAmount, getBurnEstimateCRatio, calculator } from 'lib'


import numbro from 'numbro'

import BurnActionButtons from './BurnActionButtons'
import {utils} from 'ethers'
import { ActionContainer } from 'components/Container'
import { H5 } from 'components/Text'

import Fee from 'components/Fee'
import Input from 'components/Input'
import { gasPrice } from 'helpers/gasPrice'

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
    const dataIntervalTime = 1000 * 60 * 3;

    useEffect(() => {
        const init = async() => {
            dispatch(setIsLoading(true));
            try {
                const data = await getBurnData(currentWallet);
                setBurnData(data);
                const maxAmount = getBurnMaxAmount({...data, type: 'PERIandUSDC'});
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
        const interval = setInterval( async () => await init(), dataIntervalTime);
        init();
        return () => {clearInterval(interval)}
        // eslint-disable-next-line
    }, [currentWallet]);

    const setBurningAmountChange = (value) => {
        value = value.replace(/,/g, '');

        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,18}/g)[0];
        }
        
        if(isNaN(Number(value)) || value === "") {
            setBurningAmount({
                pUSD: '',
                USDC: '0.000000',
                PERI: '0.000000',
            });
            setMaxBurningAmount({
                pUSD: maxBurningAmount['pUSD'],
                USDC: '0'
            });
            return false;
        }
            
        if( utils.parseEther(maxBurningAmount['pUSD']).lt(utils.parseEther(value))) {
            value = maxBurningAmount['pUSD'];
        }
        
        const USDCtransferTopUSD = getBurnTransferAmount({
            amount: burningAmount['USDC'],
            issuanceRatio: burnData.issuanceRatio,
            exchangeRates: burnData.exchangeRates,
            target: 'USDC',
        }); 
        
        let subtractUSDCAmount = calculator( value, USDCtransferTopUSD, 'sub')
        
        const pUSDtransferToPERI = getBurnTransferAmount({
            amount: subtractUSDCAmount,
            issuanceRatio: burnData.issuanceRatio, 
            exchangeRates: burnData.exchangeRates,
            target: 'pUSD',
            
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
                USDC: burningAmount['USDC'],    
            }
        }));

        setBurningAmount({
            pUSD: value,
            USDC: burningAmount['USDC'],
            PERI: (numbro(pUSDtransferToPERI).format({mantissa: 6}))
        });
    }

    const setBurningUSDCAmountChange = (value) => {
        value = value.replace(/,/g, '');

        if((/\./g).test(value)) {
            value = value.match(/\d+\.\d{0,18}/g)[0];
        }
        
        if(isNaN(Number(value)) || value === "") {
            setBurningAmount({
                pUSD: burningAmount['pUSD'],
                USDC: '',
                PERI: getBurnTransferAmount({
                    amount: burningAmount['pUSD'],
                    issuanceRatio: burnData.issuanceRatio, 
                    exchangeRates: burnData.exchangeRates,
                    target: 'pUSD', 
                }),
            });
            return false;
        }
        
        if( utils.parseEther(maxBurningAmount['USDC']).lt(utils.parseEther(value))) {
            value = maxBurningAmount['USDC'];
        }
        
        const USDCtransferTopUSD = getBurnTransferAmount({
            amount: value, 
            issuanceRatio: burnData.issuanceRatio,
            exchangeRates: burnData.exchangeRates,
            target: 'USDC',
        });
        
        let subtractUSDCAmount = calculator( burningAmount['pUSD'], USDCtransferTopUSD, 'sub')
        
        const pUSDtransferToPERI = getBurnTransferAmount({
            amount: subtractUSDCAmount,
            issuanceRatio: burnData.issuanceRatio, 
            exchangeRates: burnData.exchangeRates,
            target: 'pUSD', 
        });

        setEstimateCRatio(getBurnEstimateCRatio({
            balances: burnData.balances,
            exchangeRates: burnData.exchangeRates, 
            burningAmount: {
                pUSD: burningAmount['pUSD'],
                USDC: value,    
            }
        }));
        console.log(value);
        setBurningAmount({
            pUSD: burningAmount['pUSD'],
            USDC: value,
            PERI: pUSDtransferToPERI
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
                        value={burningAmount['USDC']}
                        onChange={event => setBurningUSDCAmountChange(event.target.value)}
                        maxAction={() => setAmountUSDCMax()}
                        maxAmount={maxBurningAmount['USDC']}
                    />
                    <Input key="secondary"
                        currencyName="PERI"
                        value={burningAmount['PERI']}
                        disabled={true}  
                        onBlur={() => setTransferAmount((transferAmount))}
                    />
                </div>
                <div>
                    <BurnActionButtons 
                        burnData={burnData}
                        burningAmount={burningAmount} 
                        gasPrice={gasPrice(seletedFee.price)} 
                        />
                    <Fee gasPrice={seletedFee.price}/>
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