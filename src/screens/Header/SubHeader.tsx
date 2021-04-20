import Logo from './components/Logo';
import Translation from './components/Translation';
import { HeaderContainer } from 'components/Container'
const Header = () => {
    return (
        <HeaderContainer>
            <Logo/>
            <Translation/>
        </HeaderContainer>
    );
}

export default Header;