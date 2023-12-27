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
    <Link $mobile={props.mobile} href="/">
      <LogoImg src={`/images/${themeState}/peri_logo.svg`} alt="logo"></LogoImg>
    </Link>
  );
};

const Link = styled.a<{ $mobile: string }>`
  margin-right: 10px;
  display: none;

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

const LogoImg = styled.img`
  width: 100px;
  height: 50px;
  flex-shrink: 1;
  display: flex;

  ${({ theme }) => theme.media.mobile`
    width: 60px;
    height: 30px;
  `}
`;

export default Logo;
