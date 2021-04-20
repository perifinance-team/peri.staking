import styled from 'styled-components'
import { FooterRoundContainer, FooterTitleContainer, RoundContainer, BlueBorderRoundContainer } from 'components/Container'
import { H3, H4, H5 } from 'components/Text'
import { useTranslation } from 'react-i18next';

const WalletDetail = () => {
    const { t } = useTranslation();
    return (
        <FooterRoundContainer>
            <FooterTitleContainer>
                <H4 weigth="bold">{t('walletDetail.title')}</H4>
                <FooterTitleLeftContainver>
                    <DelegateContainer>
                        <WalletImage src="/images/dark/wallet.svg"></WalletImage>
                        <DelegateText>{t('walletDetail.delegate')}</DelegateText>
                    </DelegateContainer>
                    <RefreshContainer>
                        <img src="/images/dark/refresh.svg"></img>
                    </RefreshContainer>
                </FooterTitleLeftContainver>
            </FooterTitleContainer>
            <RateContainer>
                <RateBox>
                    <RateBoxText weigth={'bold'}>0%</RateBoxText>
                    <H5>Current collateralization ratio</H5>
                </RateBox>
                <RateBox margin={10}>
                    <RateBoxText weigth={'bold'}>300%</RateBoxText>
                    <H5>Target collateralization ratio</H5>
                </RateBox>
                <RateBox>
                    <RateBoxText weigth={'bold'}>150%</RateBoxText>
                    <H5>Liquidation ratio</H5>
                </RateBox>
            </RateContainer>
            <QuoteContainer>
                <Asset>
                    <CurrencyIcon src={`images/currencies/PERI.svg`} alt="currency"/>
                    <H5>1PERI = $2.00 USD</H5>
                </Asset>
                <Asset>
                    <CurrencyIcon src={`images/currencies/ETH.svg`} alt="currency"/>
                    <H5>1PERI = $3,000.00 USD</H5>
                </Asset>
            </QuoteContainer>
        </FooterRoundContainer>
    );
}
const FooterTitleLeftContainver = styled.div`
    display: flex;
`

const RateContainer = styled.div`
    display: flex;
    flex: 1 1 1;
    width: 100%;
    margin: 20px 0px;
`

const DelegateContainer = styled(RoundContainer)`
    padding: 10px;
    height: 40px;
`

const WalletImage = styled.img`
    margin-left: 10px;
`;

const DelegateText = styled(H5)`
    margin: 10px;
`

const RefreshContainer = styled(RoundContainer)`
    height: 40px;
    padding: 14px;
`
const RateBox = styled(BlueBorderRoundContainer)<{margin?: number}>`
    margin: 0px ${(props) => props.margin ? `${props.margin}px` : '0px'};
`;

const RateBoxText = styled(H3)`
    margin: 0px 0px 0px 0px;
`;

const QuoteContainer = styled(BlueBorderRoundContainer)`
    display: flex;
    flex-direction: row;
    margin: 0px;
    height: 35px;
    justify-content: space-between;
    padding: 0px 40px;
`;

const Asset = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0px 10px;
`;

const CurrencyIcon = styled.img`
    margin: 0px 10px;
`;

export default WalletDetail;