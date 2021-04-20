import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Theme } from './theme'
import { theme } from 'styles/themes';
import { DefaultTheme } from 'styled-components';

export type ThemeStyles = {
	styles: DefaultTheme,
}

const initialState: ThemeStyles = {
	styles: theme('dark')
}

export const ThemeStylesSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		updateThemeStyles(state, actions: PayloadAction<Theme>) {
			const themeType = actions.payload;
			state.styles = theme(themeType)
		},
	},
});

export const { updateThemeStyles } = ThemeStylesSlice.actions;

export default ThemeStylesSlice.reducer;
