// import original module declarations
import 'styled-components';

interface Sizes  {
    mobile: number
    tablet: number
    desktop: number
}

type BackQuoteArgs = [TemplateStringsArray]

interface Media {
    mobile: (...args: BackQuoteArgs) => CSSProp | undefined
    tablet: (...args: BackQuoteArgs) => CSSProp | undefined
    desktop: (...args: BackQuoteArgs) => CSSProp | undefined
}

interface Colors {
    background: {
        body: string,
        aside: string,
        panel: string,
        button: {
            primary: string,
            secondary: string,
            tertiary: string,
            fourth: string,
            fifth: string,
        },
        reFresh: string,
        THeader: string,
        input: {
            primary: string,
            secondary: string
        }
    },
    border: {
        primary: string,
        secondary: string,
        tertiary: string,
        third: string,
        barChart: string,
        tableRow: string,
    },
    hover: {
        panel: string,
    },
    link: {
        active: string,
    },
    font: {
        primary: string,
        secondary: string,
        tertiary: string,
        fourth: string,
        fifth: string,
        sixth: string,
        warning: warning,
    },
    barChart: {
        primary: string,
        secondary: string,
        warning: string
    },
    table: {
        tHeader: string
    }
};

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme {
        colors: Colors,
        sizes: Sizes,
        media: Media,
        borderRadius: string,
    }
}