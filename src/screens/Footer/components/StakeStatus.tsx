import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components'

import { useSelector } from "react-redux";
import { RootState } from 'config/reducers'

import { FooterRoundContainer, FooterTitleContainer } from 'components/Container'
import { H4, H6 } from 'components/Text'
// import { useTranslation } from 'react-i18next';

import { formatCurrency, calculator, currencyToPynths, pynthsToCurrency } from 'lib'
import { utils } from 'ethers'
import numbro from 'numbro'
import Escrow from 'pages/Escrow';

const TotalBalance = () => {
    // const { t } = useTranslation();
	const PERI = useSelector((state: RootState) => state.balances.PERIBalanceInfo);
	
	const USDC = useSelector((state: RootState) => state.balances.USDCBalanceInfo);
	const { currentWallet } = useSelector((state: RootState) => state.wallet);
	const { transferablePERI, stakedUSDCamount, rewardEscrow, debtBalance } = useSelector((state: RootState) => (state.balances) );
	const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
	const targetCRatio = useSelector((state: RootState) => state.ratio.targetCRatio);
	
	const [stakedAmount, setStakedAmount] = useState({
		PERI: {
			staked: '0',
			able: '0'
		},
		escrow: {
			staked: '0',
			able: '0'
		},
		USDC: {
			staked: '0',
			able: '0'
		},
		
	})
	const [stakedRate, setStakedRate] = useState({
		PERI: '0',
		escrow: '0',
		USDC: '0',
		PERIForUSDC: '0'
	});
	
	const getRate = (stakAmount, totalBalance) => {
		
		if(numbro(stakAmount).value() === 0) {
			return '0'
		}
		if(numbro(totalBalance).value() === 0) {
			return '0'
		}
		return numbro(stakAmount).divide(totalBalance).multiply(100).format({mantissa: 2});
	}

	const getStatus = useCallback(async () => {
		const issuanceRatio = utils.parseEther(utils.parseEther('100').div(targetCRatio).toString());
		const PERIBalance = utils.formatEther(calculator(PERI.balance, rewardEscrow, 'sub'));
		const stakedPERI = utils.formatEther(calculator(PERIBalance, transferablePERI, 'sub'));

		const getEscrowStakeStatus = () => {
			const stakedUSDCTopUSD = currencyToPynths(stakedUSDCamount, issuanceRatio, exchangeRates['USDC']);
			const stakedPERITopUSD = currencyToPynths(stakedPERI, issuanceRatio, exchangeRates['PERI']);
			const balanceOfStakedpUSD = calculator(stakedUSDCTopUSD, stakedPERITopUSD, 'add');
			const escrowStakedpUSD = calculator(debtBalance, balanceOfStakedpUSD, 'sub');
			const escrowStakedPERI = utils.formatEther(pynthsToCurrency(escrowStakedpUSD, issuanceRatio, exchangeRates['PERI']));

			return {
				staked: numbro(escrowStakedPERI).format({mantissa: 2}),
				able: numbro(rewardEscrow).subtract(numbro(escrowStakedPERI).value()).format({mantissa: 2})
			}
		}
		const escrowStakeAmount = getEscrowStakeStatus()
		setStakedAmount({
			PERI: {
				staked: stakedPERI,
				able: transferablePERI
			},
			escrow: escrowStakeAmount,
			USDC: {
				staked: stakedUSDCamount,
				able: USDC.balance
			},
		});

		const totalStakedPERI = calculator(stakedPERI, escrowStakeAmount.staked, 'add');
		
		setStakedRate(
			{
				PERI: getRate(stakedPERI, PERIBalance),
				USDC: getRate(stakedUSDCamount, utils.formatEther(calculator(numbro(stakedUSDCamount).format({mantissa: 2}), USDC.balance, 'add'))),
				escrow: getRate(escrowStakeAmount.staked, rewardEscrow),
				PERIForUSDC: getRate(
					currencyToPynths(totalStakedPERI, issuanceRatio, exchangeRates['PERI']),
					utils.parseEther(debtBalance)
				)
			}
		)

	}, [currentWallet, PERI, USDC, stakedUSDCamount, targetCRatio, exchangeRates])

	useEffect( () => {
		getStatus();
	}, [currentWallet, transferablePERI, stakedUSDCamount, rewardEscrow, debtBalance]);


    return (
        <FooterRoundContainer>
            <FooterTitleContainer>
                <H4 weigth="bold">TOTAL STAKE</H4>
            </FooterTitleContainer>
            <RageContainer>
				<BarChart>
					<Graph type="range" min="0" max="100" value={stakedRate.PERI} readOnly></Graph>
					<Label>
						<H6>Staked PERI : {formatCurrency(stakedAmount.PERI.staked)}</H6>
						<H6>Transferable : {formatCurrency(stakedAmount.PERI.able)}</H6>
					</Label>
				</BarChart>
				<BarChart>
					<Graph type="range" min="0" max="100" value={stakedRate.escrow} readOnly></Graph>
					<Label>
						<H6>Escrow : {formatCurrency(stakedAmount.escrow.staked)}</H6>
						<H6>Stakeable : {formatCurrency(stakedAmount.escrow.able)}</H6>
					</Label>
				</BarChart>
				<BarChart>
					<Graph type="range" min="0" max="100" value={stakedRate.USDC} readOnly></Graph>
					<Label>
						<H6>Staked USDC : {formatCurrency(stakedAmount.USDC.staked)}</H6>
						<H6>Transferable : {formatCurrency(stakedAmount.USDC.able)}</H6>
					</Label>
				</BarChart>
				<BarChart>
						<Graph type="range" min="0" max="100" value={stakedRate.PERIForUSDC} readOnly></Graph>
						<Label>
							<H6>Staked PERI rate : {numbro(stakedRate).value() === 0 ? '0.00' : numbro(stakedRate.PERIForUSDC).format({mantissa: 2})}%</H6>
							<H6>Staked USDC rate : {numbro(stakedRate).value() === 0 ? '0.00' : numbro(100).subtract(numbro(stakedRate.PERIForUSDC).value()).format({mantissa: 2})}%</H6>
						</Label>
				</BarChart>
            </RageContainer>
        </FooterRoundContainer>
    );
}

export const RageContainer = styled.div`
    display: flex;
	width: 100%;
	height: 200px;
	flex-direction: column;
	margin-top: 20px;
`;

export const BarChart = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	margin: 5px 0px;
`;

export const Graph = styled.input`
    -webkit-appearance: none;
	overflow: hidden;
	height: 40px;
	border-radius: 100px;
	&[type='range'] {
        width: 100%;
		background: ${props => {
			const left = props.theme.colors.barChart.left;
			const right = props.theme.colors.barChart.right;
			return `linear-gradient(to right, ${left}, ${left} ${props.value}%, ${right} ${props.value}%, ${right} 100%)`
		}};
		
	}
	&::-webkit-slider-runnable-track {
		-webkit-appearance: none;
	}
	&::-webkit-slider-thumb { 
		-webkit-appearance: none;
	}
	&::-moz-range-track {
		-webkit-appearance: none;
	}

	&::-moz-range-thumb {
		-webkit-appearance: none;
	}
`;


const Label = styled.div`
	width: 100%;
	height: 40px;
	padding: 0px 40px;
	align-items: center;
	display: flex;
	justify-content: space-between;
	position: absolute;
`;

export default TotalBalance;