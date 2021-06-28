import { useTranslation } from 'react-i18next';
import { H4, H6} from 'components/Text'
import { RootState } from 'config/reducers'
import { useSelector } from "react-redux"
import * as S from './styles'
import {
    useHistory
} from "react-router-dom";

const Home = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { vestable } = useSelector((state: RootState) => state.vestable);
    const { isLPConnect } = useSelector((state: RootState) => state.lp);

    let actions = [
        'staking',
        'burn',
        'claim',
        // 'trade',
        // 'transfer',
        // 'track',
    ];
    if(isLPConnect) {
        actions.push('lp')
    }
    if(vestable) {
        actions.push('vesting')
    }

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
                            <H4 weigth={'bold'}>{action.toLocaleUpperCase()}</H4>
                            <H6>{t(`home.${action}.subTitle`)}</H6>
                        </S.ActionButtonContainer>)
                    )}
                </S.ActionButtonRow>
            </S.Container>
        </>
    );
}



export default Home;