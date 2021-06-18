
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from "react-redux";
import { setIsLoading } from 'config/reducers/app'
import { useHistory } from "react-router-dom";
import { RootState } from 'config/reducers'
import { updateBalances } from 'config/reducers/wallet/balances'
import { updateExchangeRates, updateRatio } from 'config/reducers/rates'
import { clearWallet, updateIsConnected } from 'config/reducers/wallet'

import { getExchangeRates, getRatio, getBalances, formatCurrency, calculator } from 'lib'

import { FooterRoundContainer, FooterTitleContainer, RoundContainer, BlueBorderRoundContainer } from 'components/Container'
import { H3, H4, H6 } from 'components/Text'
import { useTranslation } from 'react-i18next';
import Asset from 'components/Asset'
import { utils } from 'ethers';


const WalletDetail = () => {
    const history  = useHistory();
    const { t } = useTranslation();
    const wallet = useSelector((state: RootState) => state.wallet);
    const dispatch = useDispatch();
    const { currentCRatio, targetCRatio, liquidationRatio } = useSelector((state: RootState) => state.ratio);
    const [ ratio, setRatio ] = useState({
        currentCRatio: '0',
        targetCRatio: '0',
        liquidationRatio: '0'
    });
    
    const {PERI, USDC} = useSelector((state: RootState) => state.exchangeRates);
    
    const formatRatio = (value) => {
        if(utils.parseEther(value).eq('0')) {
            return '0';
        } else {
            return calculator('100', utils.formatEther(value), 'div').toString();
        }
    }

    useEffect( () => {
        setRatio({
            currentCRatio: formatRatio(currentCRatio),
            targetCRatio: formatRatio(targetCRatio),
            liquidationRatio: formatRatio(liquidationRatio),
        })
    }, [
        currentCRatio,
        targetCRatio,
        liquidationRatio,
    ])

    const getDatas = async () => {
        dispatch(setIsLoading(true));
        try {
            const exchangeRates = await getExchangeRates();
            dispatch(updateExchangeRates(exchangeRates));
            const ratios = await getRatio(wallet.currentWallet);
            dispatch(updateRatio(ratios));
            const balances = await getBalances(wallet.currentWallet);
            dispatch(updateBalances(balances));
            
        } catch (e) {
            console.log(e);
        }
        
        dispatch(setIsLoading(false));
    }

    const disconnet = async () => {
        history.push('/login');
        dispatch(updateIsConnected(false));
        dispatch(clearWallet());
    }

    return (
        <FooterRoundContainer>
            <FooterTitleContainer>
                <H4 weigth="bold">{t('walletDetail.title')}</H4>
                <FooterTitleLeftContainver>
                    <DelegateContainer onClick={()=> {disconnet()}}>
                        <DelegateText>DISCONNET</DelegateText>
                    </DelegateContainer>
                    <RefreshContainer onClick={()=> {getDatas()}}>
                        <img src={"/images/dark/refresh.svg"} alt="refresh"/>
                    </RefreshContainer>
                </FooterTitleLeftContainver>
            </FooterTitleContainer>
            <RateContainer>
                <RateBox>
                    <RateBoxText weigth={'bold'}>{ratio.currentCRatio}%</RateBoxText>
                    <H6>Current collateralization ratio</H6>
                </RateBox>
                <RateBox margin={10}>
                    <RateBoxText weigth={'bold'}>{ratio.targetCRatio}%</RateBoxText>
                    <H6>Target collateralization ratio</H6>
                </RateBox>
                <RateBox>
                    <RateBoxText weigth={'bold'}>{ratio.liquidationRatio}%</RateBoxText>
                    <H6>Liquidation ratio</H6>
                </RateBox>
            </RateContainer>
            <QuoteContainer>
                <Asset currencyName={'PERI'} label={`${formatCurrency(PERI, 4)} USD`}></Asset>
                <Asset currencyName={'USDC'} label={`${formatCurrency(USDC, 4)} USD`}></Asset>
            </QuoteContainer>
        </FooterRoundContainer>
    );
}

const FooterTitleLeftContainver = styled.div`
    display: flex;
`

const RateContainer = styled.div`
    display: flex;
    width: 100%;
    height: 140px;
    margin: 20px 0px;
`

const DelegateContainer = styled(RoundContainer)`
    cursor: pointer;
    padding: 10px;
    height: 40px;
`

const DelegateText = styled(H6)`
    margin: 10px;
`

const RefreshContainer = styled(RoundContainer)`
    cursor: pointer;
    height: 40px;
    padding: 14px;
    
`
const RateBox = styled(BlueBorderRoundContainer)<{margin?: number}>`
    margin: 0px ${(props) => props.margin ? `${props.margin}px` : '0px'};
`;

const RateBoxText = styled(H3)`
    margin: 0px;
`;

const QuoteContainer = styled(BlueBorderRoundContainer)`
    display: flex;
    flex-direction: row;
    margin: 0px;
    height: 40px;
    justify-content: space-between;
    padding: 10px 40px;
`;


export default WalletDetail;