import styled from 'styled-components';

const Logo = () => {
    return (
        <Link href="/">
			<LogoImg src="/images/dark/peri-logo.svg"></LogoImg>
		</Link>
    );
}

const Link = styled.a`
	margin-right: 10px;
`;

const LogoImg = styled.img`
    height: 50px;
`

export default Logo;