import React from "react";
import styled from "styled-components";

import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import LeftAside from "screens/LeftAside";
import RightAside from "screens/RightAside";
import Header from "screens/Header";

import Stake from "pages/Stake";
import Balance from "pages/Balance";
import Vesting from "pages/Vesting";
import Liquidation from "pages/Liquidation";
import LiquidNotification from "components/LiquidNotification";
import Escrow from "pages/Escrow";

const Main = () => {
	return (
		<MainContainer>
			<Router>
				<LeftAside></LeftAside>
				<RightSection>
					<Header></Header>
					<ContentSection>
						<Content>
							<Switch>
								<Route path="/stake">
									<Stake></Stake>
								</Route>
								<Route path="/balance">
									<Balance></Balance>
								</Route>
								<Route path="/vesting">
									<Vesting></Vesting>
								</Route>
								<Route path="/liquidation">
									<Liquidation></Liquidation>
								</Route>
								<Route path="/escrow">
									<Escrow></Escrow>
								</Route>
								<Route exact path="/">
									<Redirect to="/stake" />
								</Route>
							</Switch>
						</Content>
						<RightAside></RightAside>
					</ContentSection>
				</RightSection>
			</Router>
			<LiquidNotification />
		</MainContainer>
	);
};
const MainContainer = styled.div`
	display: flex;
	height: 100vh;
	width: 100vw;
	position: static;
	flex-direction: row;
	background-color: ${(props) => props.theme.colors.background.body};

	${({ theme }) => theme.media.mobile`
		flex-direction: column;
	`}
`;
const RightSection = styled.div`
	// flex: 3;
	display: flex;
	width: 87%;
	height: 100%;
	flex-direction: column;
	overflow-y: auto;

	${({ theme }) => theme.media.mobile`
		align-items: center;
		width: 100%;
	`}

	${({ theme }) => theme.media.tablet`
		align-items: center;
		width: 100%;
	`}
`;
const ContentSection = styled.div`
	flex: last;
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 100%;

	${({ theme }) => theme.media.mobile`
		flex: none;
		flex-direction: column;
	`}

	${({ theme }) => theme.media.tablet`
		flex-direction: column;
	`}
`;

const Content = styled.div`
	flex: 3;
	width: 100%;
	height: 100%;
	min-width: 262px;
	position: relative;
	overflow: hidden;

	${({ theme }) => theme.media.mobile`
		min-height: 50vh;
	`}

	${({ theme }) => theme.media.tablet`
		min-height: 52vh;
	`}
`;

export default Main;
