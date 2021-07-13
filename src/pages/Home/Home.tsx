import { useTranslation } from 'react-i18next';
import { H4, H6, H7} from 'components/Text'
import { RootState } from 'config/reducers'
import { useSelector } from "react-redux"
import * as S from './styles'
import {
    useHistory
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { pynthetix, calculator, formatCurrency } from 'lib'
import { utils } from 'ethers'

const Home = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
	const targetCRatio = useSelector((state: RootState) => state.ratio.targetCRatio);

    const { vestable } = useSelector((state: RootState) => state.vestable);
    const { isLPConnect } = useSelector((state: RootState) => state.lp);
    const [ APR, setAPR ] = useState<utils.BigNumber>(utils.bigNumberify('0'));

    const getData = async () => {
        const issuanceRatio = utils.parseEther(utils.parseEther('100').div(targetCRatio).toString());
        let totalMintpUSD = await pynthetix.js.pUSD.totalSupply();

        const totalDebt = calculator(totalMintpUSD, utils.bigNumberify('4'), 'mul');
        const rewardsAmount = calculator(calculator(utils.parseEther('76924'), exchangeRates['PERI'], 'mul'), utils.bigNumberify('52'), 'mul');
        
        setAPR(calculator(calculator(rewardsAmount, totalDebt, 'div'), utils.bigNumberify('100'), 'mul'));
    }

    useEffect(() => {
        if(targetCRatio !== '0') {
            getData();
        }
    }, [targetCRatio])

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
                            {action ==='staking' ? <H7>APR: {formatCurrency(utils.formatEther(APR), 2)}%</H7> : null}
                        </S.ActionButtonContainer>)
                    )}
                </S.ActionButtonRow>
            </S.Container>
        </>
    );
}



export default Home;