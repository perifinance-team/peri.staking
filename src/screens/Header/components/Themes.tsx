import styled from 'styled-components';
import { useSelector, useDispatch } from "react-redux"
import { RootState } from 'config/reducers'
import { updateThemeStyles } from 'config/reducers/theme'
import { updateTheme } from 'config/reducers/theme'
import { onboard } from 'lib/onboard'
const Connect = () => {
    const themeState = useSelector((state: RootState) => state.theme.theme);
    const dispatch = useDispatch();

    const themeExchange = () => {
        dispatch(updateThemeStyles(themeState === 'dark' ? "lite" : "dark"));
        dispatch(updateTheme(themeState === 'dark' ? "lite" : "dark"));
        onboard.config({ darkMode: themeState === 'dark' ? false : true})
    }

    return (
        <ThemesButton onClick={() => themeExchange()}>
            <img src={`/images/${themeState}/${themeState}.svg`} alt="theme"/>
        </ThemesButton>
    );
}

const ThemesButton = styled.button`
    
    background: none;
    border: none;
    width: 28px;
    height: 28px;
    padding: 0px;
    margin: 2px 0px 2px 10px;
    img {
        width: 28px;
        height: 28px;
    }
`

export default Connect;