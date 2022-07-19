import React from "react";
import styled from "styled-components";
import { NavLink, useRouteMatch } from "react-router-dom";
import { RootState } from "config/reducers";
import { useSelector } from "react-redux";
// import { useEffect } from 'react';

const Logo = () => {
	const { vestable } = useSelector((state: RootState) => state.vestable);
	const { networkId } = useSelector((state: RootState) => state.wallet);

	let nav = [
		{
			name: "stake",
			to: "/stake",
			active: useRouteMatch({
				path: "/stake",
			}),
			children: [
				{
					name: "mint",
					to: "/mint",
				},
				{
					name: "burn",
					to: "/burn",
				},
				{
					name: "reward",
					to: "/reward",
				},
				{
					name: "earn",
					to: "/earn",
				},
			],
		},
		{
			name: "balance",
			to: "/balance",
			active: useRouteMatch({
				path: "/balance",
			}),
		},
		{
			name: "vesting",
			to: "/vesting",
			active: useRouteMatch({
				path: "/vesting",
			}),
		},
		// {
		// 	name: "liquidation",
		// 	to: "/liquidation",
		// 	active: useRouteMatch({
		// 		path: "/liquidation",
		// 	}),
		// },
		{
			name: "escrow",
			to: "/escrow",
			active: useRouteMatch({
				path: "/escrow",
			}),
		},
	];

	return (
		<Container>
			{nav.map((item) => {
				let childrenLink;
				if (item.children?.length > 0) {
					childrenLink = item.children.map((childrenItem) => {
						if (networkId === 1285 && childrenItem.name === "earn")
							return <></>;
						else
							return (
								<ChildrenLink
									to={`${item.to}${childrenItem.to}`}
									key={childrenItem.name}
								>
									{childrenItem.name.toLocaleUpperCase()}
								</ChildrenLink>
							);
					});
				}
				if (item.name === "vesting" && vestable === false) {
					return <></>;
				} else {
					return (
						<ParentLinkContainer key={item.name}>
							<ParentLink to={item.to}>
								{item.name.toLocaleUpperCase()}
							</ParentLink>
							{item.active && childrenLink && (
								<ChildrenLinkContainer>{childrenLink}</ChildrenLinkContainer>
							)}
						</ParentLinkContainer>
					);
				}
			})}
		</Container>
	);
};

const Container = styled.div`
	margin-top: 15vh;
	display: flex;
	flex-direction: column;
`;
const ParentLinkContainer = styled.div`
	margin-bottom: 25px;
`;

const ParentLink = styled(NavLink)`
	text-decoration: none;
	width: fit-content;
	font-size: 1.8rem;
	font-weight: 800;
	color: ${(props) => props.theme.colors.font.primary};

	&.active {
		border-bottom: ${(props) => `5px solid ${props.theme.colors.link.active}`};
	}
`;

const ChildrenLinkContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 20px;
	margin-top: 20px;
`;

const ChildrenLink = styled(NavLink)`
	text-decoration: none;
	font-size: 1.4rem;
	font-weight: 800;
	margin-bottom: 10px;
	color: ${(props) => props.theme.colors.font.primary};
	&.active {
		color: ${(props) => props.theme.colors.link.active};
	}
`;

// const LogoImg = styled.img`
//     width: 100px;
//     height: 50px;
// `

export default Logo;
