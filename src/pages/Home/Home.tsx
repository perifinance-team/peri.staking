import { useTranslation } from 'react-i18next';
import { H4, H6} from 'components/Text'
import * as S from './styles'
import {
    useHistory
} from "react-router-dom";

const Home = () => {
    const { t } = useTranslation();
    const actions = [
        'staking',
        'burn',
        'claim',
        // 'trade',
        // 'transfer',
        // 'track',
    ]
    const history = useHistory();
    return (
        <>
            <S.Container>
                <S.IntroContainer>
                    <S.IntroTitle>
                        {t('home.intro.title')}
                    </S.IntroTitle>
                    <S.IntroSubTitle weigth={"regular"}>
                        {t('home.intro.subTitle')}
                    </S.IntroSubTitle>
                </S.IntroContainer> 
            </S.Container>
            <S.Container>
                <S.ActionButtonRow>
                    {actions.map((action) => 
                        (<S.ActionButtonContainer onClick={() => history.push(`/${action}`)} key={action}>
                            <S.ActionImage src={`/images/dark/actions/${action}.svg`}></S.ActionImage>
                            <H4>{action}</H4>
                            <H6>Mint pUSD by staking PERI</H6>
                        </S.ActionButtonContainer>)
                    )}
                </S.ActionButtonRow>
            </S.Container>
        </>
    );
}



export default Home;