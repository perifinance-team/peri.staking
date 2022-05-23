import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

const Logo = () => {
  const themeState = useSelector((state: RootState) => state.theme.theme);

  return (
    <Link href="/">
      <LogoImg src={`/images/${themeState}/peri_logo.svg`} alt="logo"></LogoImg>
    </Link>
  );
};

const Link = styled.a`
  margin-right: 10px;
`;

const LogoImg = styled.img`
  width: 100px;
  height: 50px;
`;

export default Logo;
