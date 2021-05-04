import { FooterRoundContainer, FooterTitleContainer } from 'components/Container'
import BalanceTable from './BalanceTable'
import { H4 } from 'components/Text'
import { useTranslation } from 'react-i18next';

const PeriBalance = () => {
    const { t } = useTranslation();
    
    return (
        <FooterRoundContainer>
            <FooterTitleContainer>
                <H4 weigth="bold">TOTAL BALANCE</H4>
            </FooterTitleContainer>
            <BalanceTable></BalanceTable>
        </FooterRoundContainer>
    );
}



export default PeriBalance;