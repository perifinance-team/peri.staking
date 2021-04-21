import styled from 'styled-components'
import { FooterRoundContainer, FooterTitleContainer, RoundContainer } from 'components/Container'
import { H4, H6 } from 'components/Text'
import { useTranslation } from 'react-i18next';

const TotalBalance = () => {
    const { t } = useTranslation();

    return (
        <FooterRoundContainer>
            <FooterTitleContainer>
                <H4 weigth="bold">{t('walletDetail.title')}</H4>
            </FooterTitleContainer>
            <RageContainer>
				<BarChart>
					<Graph type="range" min="0" max="100" value="50"></Graph>
					<Label>
						<H6>Locked : 0</H6>
						<H6>Transferable : 0</H6>
					</Label>
				</BarChart>
				<BarChart>
					<Graph type="range" min="0" max="100" value="50"></Graph>
					<Label>
						<H6>Staked : 0</H6>
						<H6>Not staked : 0</H6>
					</Label>
				</BarChart>
				<BarChart>
					<Graph type="range" min="0" max="100" value="50"></Graph>
					<Label>
						<H6>Escrowed : 0</H6>
						<H6>Not escrowed : 0</H6>
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