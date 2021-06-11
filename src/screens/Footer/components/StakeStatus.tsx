import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components'

import { useSelector } from "react-redux";
import { RootState } from 'config/reducers'

import { FooterRoundContainer, FooterTitleContainer } from 'components/Container'
import { H4, H6 } from 'components/Text'
// import { useTranslation } from 'react-i18next';

import { formatCurrency, calculator, currencyToPynths, pynthsToCurrency, pynthetix } from 'lib'
import { utils } from 'ethers'
import numbro from 'numbro'

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
		const currentUSDCDebtQuota = await pynthetix.js.PeriFinance.currentUSDCDebtQuota(currentWallet);
		
		const getEscrowStakeStatus = () => {
			if(numbro(rewardEscrow).value() === 0) {
				return {
					staked: '0.00',
					able: '0.00'
				}
			}
			const stakedUSDCTopUSD = currencyToPynths(stakedUSDCamount, issuanceRatio, exchangeRates['USDC']);
			const stakedPERITopUSD = currencyToPynths(stakedPERI, issuanceRatio, exchangeRates['PERI']);
			const balanceOfStakedpUSD = calculator(stakedUSDCTopUSD, stakedPERITopUSD, 'add');
			const escrowStakedpUSD = calculator(debtBalance, balanceOfStakedpUSD, 'sub');
			let escrowStakedPERI = pynthsToCurrency(escrowStakedpUSD, issuanceRatio, exchangeRates['PERI']);
			if(utils.parseEther(rewardEscrow).lt(utils.parseEther(rewardEscrow))) {
				escrowStakedPERI = rewardEscrow;
			}
			return {
				staked: numbro(utils.formatEther(escrowStakedPERI)).format({mantissa: 2}),
				able: numbro(rewardEscrow).subtract(numbro(utils.formatEther(escrowStakedPERI)).value()).format({mantissa: 2})
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
		
		setStakedRate(
			{
				PERI: getRate(stakedPERI, PERIBalance),
				USDC: getRate(stakedUSDCamount, utils.formatEther(calculator(numbro(stakedUSDCamount).format({mantissa: 2}), USDC.balance, 'add'))),
				escrow: getRate(escrowStakeAmount.staked, rewardEscrow),
				PERIForUSDC: numbro(stakedPERI).value() > 0 ? utils.formatEther(utils.parseEther('100').sub(currentUSDCDebtQuota)) : '0'
			}
		)

	}, [transferablePERI, rewardEscrow, debtBalance, PERI, USDC, stakedUSDCamount, targetCRatio, exchangeRates])

	useEffect( () => {
		getStatus();
		// eslint-disable-next-line
	}, [currentWallet, debtBalance]);


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
					<Graph type="range" min="0" max="100" value={stakedRate.USDC} readOnly></Graph>
					<Label>
						<H6>Staked USDC : {formatCurrency(stakedAmount.USDC.staked)}</H6>
						<H6>Transferable : {formatCurrency(stakedAmount.USDC.able)}</H6>
					</Label>
				</BarChart>
				<BarChart>
					<Graph type="range" min="0" max="100" value={stakedRate.escrow} readOnly></Graph>
					<Label>
						<H6>Staked Escrow : {formatCurrency(stakedAmount.escrow.staked)}</H6>
						<H6>Stakeable : {formatCurrency(stakedAmount.escrow.able)}</H6>
					</Label>
				</BarChart>
				<BarChart>
					<Graph type="range" min="0" max="100" value={stakedRate.PERIForUSDC} readOnly></Graph>
					<Label>
						<H6>Staked PERI rate : {numbro(stakedRate.PERIForUSDC).value() === 0 ? '0.00' : numbro(stakedRate.PERIForUSDC).format({mantissa: 2})}%</H6>
						<H6>Staked USDC rate : {numbro(stakedRate.PERIForUSDC).value() === 0 ? '0.00' : numbro(100).subtract(numbro(stakedRate.PERIForUSDC).value()).format({mantissa: 2})}%</H6>
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
	margin-top: 25px;
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