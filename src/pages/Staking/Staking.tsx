import { useEffect, useState, useCallback} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from 'config/reducers'
import { updateTransaction } from 'config/reducers/transaction'
import { pynthetix, getEstimateCRatio, getStakingAmount, getCurrencyFormat } from 'lib'
import { utils } from 'ethers'
import { useHistory } from 'react-router-dom'
import { setIsLoading } from 'config/reducers/app'

import numbro from 'numbro'

import styled from 'styled-components'
import Action from 'screens/Action'
import Input from 'components/Input'
import { BlueGreenButton } from 'components/Button'
import { H4, H5 } from 'components/Text'
import Fee from 'components/Fee'
import { ActionContainer } from 'components/Container'

import { gasPrice } from 'helpers/gasPrice'

type StakingData = {
    maxIssuable: string, 
    balanceOf: string, 
    PERIBalance: string, 
    issuanceRatio: string, 
    exchangeRates: string, 
    issuable: string
}

const Staking = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);
    
    const [stakingData, setStakingData] = useState<StakingData>({
        maxIssuable: "0",
        balanceOf: "0",
        PERIBalance: "0",
        issuanceRatio: "0",
        exchangeRates: "0",
        issuable: "0",
    });
    const [estimateCRatio, setEstimateCRatio] = useState<string>("0");
    const [stakingAmount, setStakingAmount] = useState<string>("0");
    const [mintingAmount, setMintingAmount] = useState<string>("0");
    const [gasLimit, setGasLimit] = useState<number>(0);

    const { js: { PeriFinance, Issuer, ExchangeRates } }  = pynthetix as any;
    const { PERIBalance, balanceOf, exchangeRates, issuanceRatio, issuable } = stakingData;

    const currenciesToBytes = {
        PERI: utils.formatBytes32String('PERI'),
        pUSD: utils.formatBytes32String('pUSD'),
        USDC: utils.formatBytes32String('USDC'),
    }
    const getIssuanceData = useCallback(async () => {
        dispatch(setIsLoading(true));
        try {
            const maxIssuable = utils.formatEther(await PeriFinance.maxIssuablePynths(currentWallet, currenciesToBytes['pUSD']));
            const balanceOf = utils.formatEther(await PeriFinance.debtBalanceOf(currentWallet, currenciesToBytes['pUSD']));
            const PERIBalance = utils.formatEther(await PeriFinance.collateral(currentWallet));
            const issuanceRatio = utils.formatEther(await Issuer.issuanceRatio());
            const exchangeRates = utils.formatEther(await ExchangeRates.rateForCurrency(currenciesToBytes['PERI']));
            const issuable = (await PeriFinance.remainingIssuablePynths(currentWallet));
            setStakingData({ maxIssuable, balanceOf, PERIBalance, issuanceRatio, exchangeRates, issuable: utils.formatEther(issuable[0].toString()) });
            
        } catch (e) {
            console.log(e);
        }
        dispatch(setIsLoading(false));
        
    }, [])

    useEffect(() => {
        const init = async() => {
            await getIssuanceData();
        }
        
        init();
        return () => {
            setStakingData({
                maxIssuable: "0",
                balanceOf: "0",
                PERIBalance: "0",
                issuanceRatio: "0",
                exchangeRates: "0",
                issuable: "0",
            })
        };
    } ,[]);

    const setAmount = (event) => {
        let value = event.target.value;
        
        if(numbro(issuable).clone().subtract(numbro(value).value()).value() < 0 ) {
            value = issuable;
        }
        setEstimateCRatio(getEstimateCRatio({ PERIBalance, balanceOf, exchangeRates, mintingAmount: event.target.value }));
        setStakingAmount(getStakingAmount({issuanceRatio, exchangeRates, mintingAmount: event.target.value}));
        setMintingAmount(value);
        getGasEstimate();
    }

    const setAmountMax = () => {
        setMintingAmount(getCurrencyFormat(issuable))
        setEstimateCRatio(getEstimateCRatio({ PERIBalance, balanceOf, exchangeRates, mintingAmount: issuable }));
        setStakingAmount(getStakingAmount({issuanceRatio, exchangeRates, mintingAmount: issuable}));
        getGasEstimate();
    }
    const getGasEstimate = async () => {
        let estimateGasLimit;

        try {
            if(numbro(mintingAmount).value().toString() === issuanceRatio) {
                estimateGasLimit = await PeriFinance.contract.estimate.issueMaxPynths()
            } else {
                estimateGasLimit = await PeriFinance.contract.estimate.issuePynths(
                    utils.parseEther(numbro(mintingAmount).value().toString())
                )
            }
            setGasLimit(numbro(estimateGasLimit).multiply(1.2).value());
        } catch(e) {

        }
    }

    const onSaking = async () => {
        dispatch(setIsLoading(true));
        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit,
        }
        try {
            let transaction;
            if(numbro(mintingAmount).value().toString() === issuanceRatio) {
                transaction = await PeriFinance.issueMaxPynths(transactionSettings);
            } else {
                transaction = await PeriFinance.issuePynths(
                    utils.parseEther(numbro(mintingAmount).value().toString()),
                    transactionSettings
                );
            }
            
            dispatch(updateTransaction(
                {
                    hash: transaction.hash,
                    message: `Staked & Minted ${getCurrencyFormat(mintingAmount)} pUSD`,
                    type: 'Staked & Minted'
                }
            ));
            history.push('/')
        } catch(e) {
            console.log(e);
        }   
        dispatch(setIsLoading(false));
    }

    const currencies = ['USDC', 'pUSD'];

    return (
        <Action title="STAKING"
            subTitles={[
                "Mint pUSD by staking your PERI.",
                "This gives you a Collateralization Ratio and a debt, allowing you to earn staking rewards."
            ]}
        >
            <ActionContainer>
                <div>
                    <Input key="primary"
                        currencyName="pUSD"
                        currencies={currencies}
                        value={mintingAmount}
                        onChange={setAmount}
                        onBlur={() => setMintingAmount(getCurrencyFormat(mintingAmount))}
                        maxAction={() => setAmountMax()}
                    />
                    <StakingInfoContainer>
                        <H5>Staking: {stakingAmount} PERI</H5>
                        <H5>Estimated C-Ratio: {estimateCRatio}%</H5>
                    </StakingInfoContainer>
                </div>
                <div>
                    <StakingButton onClick={ () => onSaking()}><H4 weigth="bold">STAKE & MAINT</H4></StakingButton>
                    <Fee gasPrice={seletedFee.price} gasLimit={gasLimit}/>
                </div>
            </ActionContainer>
        </Action>
        
    );
}

const StakingInfoContainer = styled.div`
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
`

const StakingButton = styled(BlueGreenButton)`
    width: 100%;
    height: 50px;
`
export default Staking;