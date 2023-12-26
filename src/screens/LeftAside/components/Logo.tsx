import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

type LogoProps = {
  mobile?: string;
};
const Logo = (props:LogoProps) => {
  const themeState = useSelector((state: RootState) => state.theme.theme);

  return (
    <Link href="/">
      <LogoImg $mobile={props.mobile} src={`/images/${themeState}/peri_logo.svg`} alt="logo"></LogoImg>
    </Link>
  );
};

const Link = styled.a`
  margin-right: 10px;
`;

const LogoImg = styled.img<{ $mobile: string }>`
  width: 100px;
  height: 50px;
  flex-shrink: 1;
  display: ${(props) => props.$mobile ? "none" : "flex"};
  

  ${({ theme }) => theme.media.mobile`
    width: 60px;
    height: 30px;
    display: none;
  `}

  ${({ $mobile, theme }) => $mobile === "mobile" ? theme.media.mobile`
    display: flex;
    ` : null
  }

  ${({ $mobile, theme }) => $mobile === "tablet" ? theme.media.tablet`
    display: flex;
    ` : null
  }

  ${({ $mobile, theme }) => $mobile === "desktop" ? theme.media.desktop`
    display: flex;
    ` : null
  }
`;

export default Logo;
