import { H5, H6 } from 'components/Text'
import { useSelector } from "react-redux"
import { RootState } from 'config/reducers'
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";

import Action from 'screens/Action'
import { ActionContainer } from 'components/Container'
import StakingToPERI from './StakingToPERI'
import StakingToPERIandUSDC from './StakingToPERIandUSDC'
import StakingToUSDC from './StakingToUSDC'
import { useEffect, useState } from 'react';
import { pynthetix, calculator, formatCurrency } from 'lib'
import { utils } from 'ethers'

import * as S from './styles'

const Staking = () => {
    const history = useHistory();
    const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
	const targetCRatio = useSelector((state: RootState) => state.ratio.targetCRatio);
    const [ APY, setAPY ] = useState<utils.BigNumber>(utils.bigNumberify('0'));

    const getData = async () => {
        const issuanceRatio = utils.parseEther(utils.parseEther('100').div(targetCRatio).toString());
        let totalMintpUSD = await pynthetix.js.pUSD.totalSupply();
        console.log(utils.formatEther(totalMintpUSD))

        const totalDebt = calculator(totalMintpUSD, utils.bigNumberify('4'), 'mul');
        const rewardsAmountToAPY = calculator(calculator(utils.parseEther('76924'), exchangeRates['PERI'], 'mul'), utils.bigNumberify('52'), 'mul');
        
        setAPY(calculator(calculator(rewardsAmountToAPY, totalDebt, 'div'), utils.bigNumberify('100'), 'mul'));
    }

    useEffect(() => {
        if(targetCRatio !== '0') {
            getData();
        }
    }, [targetCRatio])

    return (
        <Action title="STAKING"
            subTitles={[
                "Mint pUSD by staking your PERI.",
                "This gives you a Collateralization Ratio and a debt, allowing you to earn staking rewards.",
            ]}
            PY={[
                `APY: ${formatCurrency(utils.formatEther(APY), 2)}%`,
            ]}
            
        >
            
            <Switch>
                <Route exact path="/staking">
                    <ActionContainer>
                        <S.ActionButtonRow>
                            <S.ActionButtonContainer onClick={() => history.push(`/staking/PERI`)}>
                                <S.ActionImage src={`/images/dark/actions/staking.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                    <H5 weigth={'bold'}>Staking</H5>
                                    <H6 weigth={'bold'}>only PERI</H6>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>
                            
                            <S.ActionButtonContainer onClick={() => history.push(`/staking/USDC`)}>
                                <S.ActionImage src={`/images/dark/actions/staking.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                <H5 weigth={'bold'}>Staking</H5>
                                <H6 weigth={'bold'}>only USDC</H6>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>

                            <S.ActionButtonContainer onClick={() => history.push(`/staking/PERIandUSDC`)}>
                                <S.ActionImage src={`/images/dark/actions/staking.svg`}></S.ActionImage>
                                <S.ActionButtonTitle>
                                    <H5 weigth={'bold'}>Staking </H5>
                                    <H6 weigth={'bold'}>PERI and USDC</H6>
                                </S.ActionButtonTitle>
                            </S.ActionButtonContainer>
                        </S.ActionButtonRow>
                    </ActionContainer>        
                </Route>

                <Route exact path="/staking/PERI"> 
                    <StakingToPERI/>
                </Route>

                <Route exact path="/staking/PERIandUSDC"> 
                    <StakingToPERIandUSDC/>
                </Route>

                <Route exact path="/staking/USDC"> 
                    <StakingToUSDC/>
                </Route>

            </Switch>
        </Action>
    );
}



export default Staking;