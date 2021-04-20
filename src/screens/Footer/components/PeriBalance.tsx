import styled from 'styled-components'
import { FooterRoundContainer, FooterTitleContainer, RoundContainer } from 'components/Container'
import { H4 } from 'components/Text'
import { useTranslation } from 'react-i18next';

const PeriBalance = () => {
    const { t } = useTranslation();
    return (
        <FooterRoundContainer>
            <FooterTitleContainer>
                <H4 weigth="bold">{t('walletDetail.title')}</H4>
                <div>
                    <RoundContainer>
                        <img></img>
                        
                    </RoundContainer>
                    <RoundContainer>
                        <img></img>
                    </RoundContainer>
                </div>
            </FooterTitleContainer>
            

        </FooterRoundContainer>
    );
}

export default PeriBalance;