import React from "react";
import styled from "styled-components";
import { NavLink, useRouteMatch } from "react-router-dom";
import { RootState } from "config/reducers";
import { useSelector } from "react-redux";
import { lpContractAddress } from "lib/contract/LP";
// import { useEffect } from 'react';

const Navigator = () => {
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
			children: [
				{
					name: "vesting",
					to: "/vesting",
				},
				{
					name: "liquidation",
					to: "/liquidation",
				},
				{
					name: "escrow",
					to: "/escrow",
				}
			],
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
		// {
		// 	name: "escrow",
		// 	to: "/escrow",
		// 	active: useRouteMatch({
		// 		path: "/escrow",
		// 	}),
		// },
	];

	return (
		<Container>
			{nav.map((item) => {
				let childrenLink;
				if (item.children?.length > 0) {
					childrenLink = item.children.map((childrenItem) => {
						if ((lpContractAddress[networkId] || childrenItem.name !== "earn") && (childrenItem.name !== "vesting" || vestable !== false)) /* return <></>; */
						/* else */
							return (
								<ChildrenLink to={`${item.to}${childrenItem.to}`} key={childrenItem.name}>
									{childrenItem.name.toLocaleUpperCase()}
								</ChildrenLink>
							);
					});
				}
				if (item.name !== "vesting" || vestable !== false) {
					/* return <></>; */
				/*}  else { */
					return ( 
						<ParentLinkContainer key={item.name}>
							<ParentLink to={item.to} key={item.name}>{item.name.toLocaleUpperCase()}</ParentLink>
							{/* {item.active && childrenLink && ( */}
								<ChildrenLinkContainer $active={item.active && childrenLink}>{childrenLink}</ChildrenLinkContainer>
							{/* )} */}
						</ParentLinkContainer>  
					);
				} 
			})}
		</Container>
	);
};

const Container = styled.div`
	margin-top: 9vh;
	display: flex;
	flex-direction: column;

	${({ theme }) => theme.media.mobile`
		margin-top: 0;
	`}

	${({ theme }) => theme.media.tablet`
		margin-top: 0;
	`}
`;
const ParentLinkContainer = styled.div`
	margin-bottom: 10px;
`;

const ParentLink = styled(NavLink)`
	text-decoration: none;
	width: fit-content;
	font-size: 1.125rem;
	font-weight: 800;
	color: ${(props) => props.theme.colors.font.primary};

	&.active {
		// border-bottom: ${(props) => `5px solid ${props.theme.colors.link.active}`};
		color: ${(props) => props.theme.colors.link.active};
	}

	${({ theme }) => theme.media.mobile`
		font-size: 0.9rem;
	`}
`;

const ChildrenLinkContainer = styled.div<{ $active?: boolean }>`
	display: ${(props) => (props.$active ? "flex" : "none")};
	flex-direction: column;
	margin-left: 25px;
	margin-top: 15px;

	${({ theme }) => theme.media.mobile`
		margin-left: 10px;
		display: flex;
	`}

	${({ theme }) => theme.media.tablet`
		margin-left: 10px;
		display: flex;
	`}
`;

const ChildrenLink = styled(NavLink)`
	
	text-decoration: none;
	font-size: 0.913rem;
	font-weight: 800;
	margin-bottom: 15px;
	color: ${(props) => props.theme.colors.font.primary};
	&.active {
		color: ${(props) => props.theme.colors.link.active};
	}

	${({ theme }) => theme.media.mobile`
		font-size: 0.7rem;
		margin-bottom: 15px;
	`}
`;

// const LogoImg = styled.img`
//     width: 100px;
//     height: 50px;
// `

export default Navigator;
