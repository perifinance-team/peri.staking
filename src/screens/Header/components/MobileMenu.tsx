import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Navigator from "screens/LeftAside/components/Navigator";

const MobileMenu = () => {
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
  <MobileMenuContainer $open={isMobileMenuOpen}>
    <MobileMenuImage
      $open={isMobileMenuOpen}
      id={"mobile-menu"}
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      src={"/images/icon/drawer.svg"}
    />
    <BlockContainer $open={isMobileMenuOpen}/>
    <MobileMenuList $open={isMobileMenuOpen}>
      <Navigator />
    </MobileMenuList>
  </MobileMenuContainer>
  );
};

const MobileMenuContainer = styled.button<{ $open: boolean }>`
  display: none;
  order: last;
  position: relative;
  width: 30px;
  height: 30px;
  padding: ${(props) => (props.$open 
    ? `5px` 
    : `0`
  )};
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.background.body};
  border: 1px solid ${(props) => (props.$open 
    ? `${props.theme.colors.border.tableRow}` 
    : `${props.theme.colors.border.third}` )};
  box-shadow: ${(props) => (props.$open 
    ? `0px 0px 10px ${props.theme.colors.border.primary}` 
    : `0px 0px 0px ${props.theme.colors.border.primary}`
  )};

  ${({ theme }) => theme.media.mobile`
    display: block;
  `}

  ${({ theme }) => theme.media.tablet`
    display: block;
  `}
`;

const BlockContainer = styled.div<{ $open: boolean }>`
  display: ${(props) => (props.$open ? "static" : "none")};
  position: absolute;
  top: 15px;
  right: 0px;
  width: 100%;
  height: 20px;
  background-color: ${(props) => props.theme.colors.background.body};
  z-index: 1000;
`;

const MobileMenuImage = styled.img<{ $open: boolean }>`
  position: relative;
  z-index: 1001;

  width: ${({ $open }) => ($open ? "15px" : "20px")};
  height: ${({ $open }) => ($open ? "15px" : "20px")};

  &:active {
    transition: 0.2s ease-in-out;
    transform: translateY(5%);
  }
`;

const MobileMenuList = styled.div<{ $open: boolean }>`
  position: absolute;
  display: ${({ $open }) => ($open ? "flex" : "none")};
  justify-content: center;
  right: 0px;
  width: 160px;
  border-radius: 10px 0 10px 10px;
  padding: 10px 0px;
  z-index: 999;
  opacity: 1;

  background: ${(props) => props.theme.colors.background.body};
  box-shadow: ${(props) => `0px 0px 10px ${props.theme.colors.border.primary}`};
  border-top: 1px solid ${(props) => props.theme.colors.border.tableRow};

  ${({ theme }) => theme.media.mobile`
    width: 140px;
  `}
`;

export default MobileMenu;
