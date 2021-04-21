import styled from 'styled-components'
import { FooterRoundContainer, FooterTitleContainer, RoundContainer, BlueBorderRoundContainer } from 'components/Container'
import { H3, H4, H6 } from 'components/Text'
import { useTranslation } from 'react-i18next';
import Asset from 'components/Asset'
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
                        <img src={"images/dark/refresh.svg"} alt="refresh"/>
                    </RefreshContainer>
                </FooterTitleLeftContainver>
            </FooterTitleContainer>
            <RateContainer>
                <RateBox>
                    <RateBoxText weigth={'bold'}>0%</RateBoxText>
                    <H6>Current collateralization ratio</H6>
                </RateBox>
                <RateBox margin={10}>
                    <RateBoxText weigth={'bold'}>300%</RateBoxText>
                    <H6>Target collateralization ratio</H6>
                </RateBox>
                <RateBox>
                    <RateBoxText weigth={'bold'}>150%</RateBoxText>
                    <H6>Liquidation ratio</H6>
                </RateBox>
            </RateContainer>
            <QuoteContainer>
                <Asset currencyName={'PERI'} label={'1PERI = $2.00 USD'}></Asset>
                <Asset currencyName={'ETH'} label={'1PERI = $3,000.00 USD'}></Asset>
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
    padding: 10px;
    height: 40px;
`

const WalletImage = styled.img`
    margin-left: 10px;
`;

const DelegateText = styled(H6)`
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