import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import styled, { css } from "styled-components";

import { RootState } from "config/reducers";

import { H1, H2 } from "components/heading";
import { Paragraph } from "components/paragraph";

import Mint from "./Mint";
import Burn from "./Burn";
import Reward from "./Reward";
import Earn from "./Earn";
import { stable } from "lib/contract/contracts";
import { lpContractAddress } from "lib/contract/LP";

const Stake = () => {
	const { t } = useTranslation();

	const [activeTab, setActiveTab] = useState<string>("mint");
	const themeState = useSelector((state: RootState) => state.theme.theme);
	const { networkId } = useSelector((state: RootState) => state.wallet);	
	const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
	const [currencies, setCurrencies] = useState<any>([
		{ name: "PERI", iisExternal: true, isLP: false },
		{ name: "USDC", isExternal: true, isLP: false },
		{ name: "DAI", isExternal: true, isLP: false },
	])
	const [LPs, setLPs] = useState<Array<any>>([]);

	useEffect(() => {
		const currencies = [
			{ name: "PERI", isExternal: false, isLP: false },
			{ name: "USDC", isExternal: true, isLP: false },
			{ name: "DAI", isExternal: true, isLP: false },
		];

		const stables = stable[networkId];
		if (stables) {
			stable[networkId]["USDT"] && currencies.push({ name: "USDT", isExternal: true, isLP: false });
			stable[networkId]["XAUT"] && currencies.push({ name: "XAUT", isExternal: true, isLP: false });
			stable[networkId]["PAXG"] && currencies.push({ name: "PAXG", isExternal: true, isLP: false });
		}
		
		if (lpContractAddress[networkId]) {
			setLPs([{ name: "LP", isExternal: false, isLP: true }]);
			currencies.push({ name: "LP", isExternal: false, isLP: true });
		}
		setCurrencies(currencies);
	}, [exchangeRates, networkId]);

	return (
		<Router basename="/stake">
			<Switch>
				<Route exact path="/">
					<Container>
						<Title>
							<H1>ISSUE PYNTHS</H1>
						</Title>
						<LinkContainer>
							{["mint", "burn", "reward"].map((link, index) => {
								return (
									<StyledLink
										to={`/${link}`}
										$active={activeTab === link}
										$margin={index === 1}
										onMouseOver={() => setActiveTab(link)}
										key={link}
									>
										<H2>{link.toLocaleUpperCase()}</H2>
										{activeTab === link ? (
											<img src={`/images/${themeState}/${link}_active.svg`} alt="link" />
										) : (
											<img src={`/images/${themeState}/${link}.svg`} alt="link" />
										)}

										<Paragraph $fontSize={1.125} $weight={"m"}>
											{t(`stake.explanation.${link}`)}
										</Paragraph>
									</StyledLink>
								);
							})}
						</LinkContainer>
					</Container>
				</Route>
				<Route exact path="/mint">
					<Mint currencies={currencies}></Mint>
				</Route>
				<Route exact path="/burn">
					<Burn currencies={currencies}></Burn>
				</Route>
				<Route exact path="/reward">
					<Reward></Reward>
				</Route>
				{LPs.length > 0 && 
				<Route exact path="/earn">
					<Earn LPs={LPs}></Earn>
				</Route>}
			</Switch>
		</Router>
	);
};

const Container = styled.div`
	// position: relative;
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	align-items: center;

	${({ theme }) => theme.media.mobile`
		// flex: none;
		width: 100%;
		height: 100%;
		justify-content: center;
	`}
`;

const Title = styled.div`
	// position: absolute;
	width: 100%;
	z-index: 0;
	top: 7%;
	display: flex;
	justify-content: center;

	h1 {
		display: inline-block;
		width: fit-content;
		height: fit-content;
		vertical-align: bottom;
		text-align: center;
		padding: 0px;
	}

	${({ theme }) => theme.media.mobile`
		position: absolute;
		top: 3%;

		h1 {
			width: 100%;
		}
	`}
`;

const LinkContainer = styled.div`
	z-index: 1;
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: flex-start;
	padding: 0;
	height: 45vh;

	${({ theme }) => theme.media.mobile`
		align-items: center;
		margin-top: 10px;
		height: 55%;
	`}

	${({ theme }) => theme.media.tablet`
		align-items: center;
		margin-top: 10px;
		height: 35vh;
	`}
`;

const StyledLink = styled(Link)<{ $active: boolean; $margin: boolean }>`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 20%;
	height: 90%;
	min-width: 180px;
	max-width: 340px;
	flex-direction: column;
	margin: ${(props) => (props.$margin ? "0px 25px" : "")};
	color: ${(props) => props.theme.colors.font.primary};
	text-decoration: none;
	border-radius: 10px;
	background-color: ${(props) => props.theme.colors.background.body};
	border: ${({theme}) => `1px solid ${theme.colors.border.tableRow}`};
	box-shadow: 0.5px 1.5px 15px ${(props) => props.theme.colors.background.button.primary};
	${(props) =>
		props.$active
			? css({
					width: "28%",
					"min-width": "200px",
					"max-width": "340px",
					"color": props.theme.colors.background.button.primary,
			})
			: null}

	h2 {
		${(props) =>
			props.$active
				? css({
						"color": props.theme.colors.background.button.primary,
				})
				: null}
	}

	p {
		height: 80px;
		max-width: 200px;
		min-width: 100px;
		vertical-align: middle;
	}

	img {
		width: 80px;
		height: 80px;
		margin: 20px;
		${(props) => (props.$active ? css({ width: "120px", height: "90px" }) : null)}
	}

	${({theme}) => theme.media.mobile`
		// height: 80%;
		margin: 0px 3px;

		p {
			height: 22x;
			max-width: 100px;
			min-width: 90px;
			font-size: 0.6rem;
		}

		img {
			margin: 7px;
		}
	`}

	${({$active, theme}) => $active 
		? theme.media.mobile`
			width: 33%;
			min-width: 100px;
			max-width: 140px;

			img {
				width: 32px;
				height: 32px;
			}
		` : theme.media.mobile`
			width: 27%;
			min-width: 90px;
			max-width: 116px;

			img {
				width: 28px;
				height: 28px;
			}
		`
	}

	${({theme}) => theme.media.tablet`
		// height: 80%;
		margin: 0px 6px;

		p {
			height: 22x;
			max-width: 120px;
			min-width: 100px;
			font-size: 0.65rem;
		}

		img {
			margin: 10px;
		}
	`}

	${({$active, theme}) => $active 
		? theme.media.tablet`
			width: 34%;
			min-width: 130px;
			max-width: 170px;

			img {
				width: 32px;
				height: 32px;
			}
		` : theme.media.tablet`
			width: 27%;
			min-width: 90px;
			max-width: 140px;

			img {
				width: 28px;
				height: 28px;
			}
		`
	}

`;

export default Stake;
