import React from "react";
import styled from "styled-components";

import {
	HashRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

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
	flex-direction: row;
`;
const RightSection = styled.div`
	flex: 3;
	display: flex;
	flex-direction: column;
	background-color: ${(props) => props.theme.colors.background.body};
`;
const ContentSection = styled.div`
	flex: 15;
	display: flex;
	flex-direction: row;
`;

const Content = styled.div`
	flex: 3;
`;

export default Main;
