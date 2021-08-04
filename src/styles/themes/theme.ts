import { dark } from './dark'
import { light } from './light'
import { DefaultTheme } from 'styled-components'

type Theme = (themeName: string) => DefaultTheme;

export const theme: Theme = (themeName: string) => {
	const colors = themeName === 'dark' ? dark : light;
    return {
        colors,
    }
}