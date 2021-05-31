import { useEffect, useState } from 'react';
import styled from 'styled-components'

import { useSelector } from "react-redux";
import { RootState } from 'config/reducers'

import { FooterRoundContainer, FooterTitleContainer } from 'components/Container'
import { H4, H6 } from 'components/Text'
// import { useTranslation } from 'react-i18next';

import { pynthetix, formatCurrency } from 'lib'
import { utils } from 'ethers'
import numbro from 'numbro'

const TotalBalance = () => {
    // const { t } = useTranslation();
	const PERI = useSelector((state: RootState) => state.balances.PERIBalanceInfo);
	const USDC = useSelector((state: RootState) => state.balances.USDCBalanceInfo);
	const { currentWallet } = useSelector((state: RootState) => state.wallet);
	const { transferablePERI, stakedUSDCamount} = useSelector((state: RootState) => (state.balances) );
	const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
	const targetCRatio = useSelector((state: RootState) => state.ratio.targetCRatio);

	const stakedPERI:number = numbro(PERI.balance).subtract(numbro(transferablePERI).value()).value();
	const totalStakedPERI = numbro(stakedPERI).divide(numbro(transferablePERI).value()).multiply(100).value();
	const totalStakedUSDC = numbro(stakedUSDCamount).divide(numbro(USDC.balance).value()).multiply(100).value();
	const [stakedRate, setStakedRate] = useState('0');

	const getStakingRate = async () => {
		const debt = utils.formatEther(await pynthetix.js.PeriFinance.debtBalanceOf(currentWallet, utils.formatBytes32String('pUSD')));
		
		setStakedRate(
			numbro(stakedPERI).multiply(numbro(exchangeRates['PERI']).value()).multiply(numbro(targetCRatio).value())
			.divide(numbro(debt).value()).multiply(100).value().toString()
		);
	}

	useEffect( () => {
		const init = async () => {
			await getStakingRate();
		}
		init();
		
	}, [currentWallet, PERI, USDC]);


    return (
        <FooterRoundContainer>
            <FooterTitleContainer>
                <H4 weigth="bold">TOTAL STAKE</H4>
            </FooterTitleContainer>
            <RageContainer>
				{/* <BarChart>
					<Graph type="range" min="0" max="100" value="50" readOnly></Graph>
					<Label>
						<H6>Locked : 0</H6>
						<H6>Transferable : 0</H6>
					</Label>
				</BarChart> */}
				<BarChart>
					<Graph type="range" min="0" max="100" value={totalStakedPERI} readOnly></Graph>
					<Label>
						<H6>Staked PERI : {formatCurrency(stakedPERI)}</H6>
						<H6>Transferable : {formatCurrency(transferablePERI)}</H6>
					</Label>
				</BarChart>
				<BarChart>
					<Graph type="range" min="0" max="100" value={totalStakedUSDC} readOnly></Graph>
					<Label>
						<H6>Staked USDC : {formatCurrency(stakedUSDCamount)}</H6>
						<H6>Transferable : {formatCurrency(USDC.balance)}</H6>
					</Label>
				</BarChart>
				<BarChart>
					<Graph type="range" min="0" max="100" value={stakedRate} readOnly></Graph>
					<Label>
						<H6>Staked PERI rate : {numbro(stakedRate).format({mantissa: 2})}%</H6>
						<H6>Staked USDC rate : {numbro(100).subtract(numbro(stakedRate).value()).format({mantissa: 2})}%</H6>
					</Label>
				</BarChart>
				
				{/* <BarChart>
					<Graph type="range" min="0" max="100" value={totalStakedUSDC} readOnly></Graph>
					<Label>
						<H6>Staked PERI : {formatCurrency(stakedUSDCamount)}</H6>
						<H6>Staked USDC : {formatCurrency(USDC.balance)}</H6>
					</Label>
				</BarChart> */}

				{/* <BarChart>
					<Graph type="range" min="0" max="100" value="50" readOnly></Graph>
					<Label>
						<H6>Escrowed : 0</H6>
						<H6>Not escrowed : 0</H6>
					</Label>
				</BarChart> */}
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
	margin: 10px 0px;
`;

export const Graph = styled.input`
    -webkit-appearance: none;
	overflow: hidden;
	height: 50px;
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
	height: 50px;
	padding: 0px 40px;
	align-items: center;
	display: flex;
	justify-content: space-between;
	position: absolute;
`;

export default TotalBalance;