import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import Network from "./components/Network";
import DebtBalance from "./components/DebtBalance";
import Ratios from "./components/Ratios";
import Logo from "screens/LeftAside/components/Logo";
import Navigator from "screens/LeftAside/components/Navigator";
// import Connect from "./components/Connect";
// import Translation from './components/Translation';
// import Themes from './components/Themes'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
	const closeModalHandler = (e) => {
		if (e.target.id !== "mobile-menu" && !modalRef.current?.contains(e.target)) {
			setIsMobileMenuOpen(false);
		}
	};

  useEffect(() => {
		window.addEventListener("click", closeModalHandler);
		return () => {
			window.removeEventListener("click", closeModalHandler);
		};
	}, []);
  return (
    <Container>
      {/* <Connect /> */}
      <MainContainer>
        <Logo mobile={'tablet'}/>
        <RatioContainer>
          <LineContainer/>
          <StatContainer>
            <Ratios/> 
            <DebtBalance/>
          </StatContainer>
          <LineContainer/>
        </RatioContainer>
        <RightContainer>
          <Logo mobile={'mobile'}/>
          <WalletMenuContainer>
            <Network />
            <MobileMenuContainer>
              <MobileMenuImage
                id={"mobile-menu"}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                src={"/images/icon/drawer.svg"}
              />
              <MobileMenu $open={isMobileMenuOpen}>
                <Navigator/>
              </MobileMenu>
            </MobileMenuContainer>
          </WalletMenuContainer>
        </RightContainer>
      </MainContainer>
      {/* Todo: Themes need to be implemented when needed */}
      {/* <Themes/> */}
      {/* <Translation/> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 25px 0px;
  width: 100%;

  ${({ theme }) => theme.media.mobile`
    padding: 0px;
  `}
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  frex-wrap: nowrap;
  width: 92%;
  min-width: 262px;

  ${({ theme }) => theme.media.mobile`
    flex-direction: column;
    align-items: center;
    padding: 10px 10px 0px 10px;
    width: 100%;
  `}

  ${({ theme }) => theme.media.tablet`
    justify-content: center;
    padding: 25px 30px;
    width: 100%;
  `}
  
`;

const RatioContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 75%;
  min-height: 50px;

  ${({ theme }) => theme.media.mobile`
    width: 100%;
    order: 2;
  `}

`;

const StatContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  
  ${({ theme }) => theme.media.mobile`
    flex-direction: column;
    width: 100%;
  `}

`;

const LineContainer = styled.div`
  display: flex;
  height: 2px;
  width: 97%;
  margin: 10px 0px;
  // background: ${(props) => props.theme.colors.border.primary};
  box-shadow: ${(props) => `0px 0px 20px ${props.theme.colors.border.primary}`};
  border-top: 1px solid ${(props) => props.theme.colors.border.tableRow};

  ${({ theme }) => theme.media.mobile`
    width: 100%;
    margin: 5px 0px;
  `}
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 25%;

  ${({ theme }) => theme.media.mobile`
    width: 95%;
    order: first;
    justify-content: space-between;
    margin: 5px 5px;
  `}

`;

const WalletMenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;

  ${({ theme }) => theme.media.mobile`
    order: first;
    margin: 5px 10px;
  `}

`;

const MobileMenuContainer = styled.div`
  display: none;
  order: last;
  position: relative;
  justify-content: flex-start;
  top: 3px;

  ${({ theme }) => theme.media.mobile`
    display: block;
    width: fit-content;
    margin-left: 10px; 
  `}

  ${({ theme }) => theme.media.tablet`
    display: block;
    width: fit-content;
    margin-left: 10px; 
  `}

`;

const MobileMenu = styled.div<{$open:boolean}>`
  position: absolute;
  display: ${({ $open }) => ($open ? "flex" : "none")};
  justify-content: center;
  right: 0px;
  width: 160px;
  border-radius: 10px;
  padding: 10px 0px;
  z-index: 100;
  opacity: 1;

  background: ${(props) => props.theme.colors.background.body};
  box-shadow: ${(props) => `0px 0px 10px ${props.theme.colors.border.primary}`};
  border-top: 1px solid ${(props) => props.theme.colors.border.tableRow};

  ${({ theme }) => theme.media.mobile`
    width: 140px;
  `}

`;

const MobileMenuImage = styled.img`
  ${({ theme }) => theme.media.mobile`
    width: 20px;
    height: 20px;
  `}
`;



export default Header;
