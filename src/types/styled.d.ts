// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: {
        body: string,
        panel: string,
        button: string,
      },
      border: string,
      font: {
        primary: string,
        secondary: string,
        red: string,
      },
      button: {
        primary: string,
        secondary: string,
      },
      hover: {
          button: string,
          background: string
      },
      barChart: {
        left: string,
        right: string
      }
    };
    
    fontFamilies: {
      regular: string,
      medium: string,
      bold: string
    }
  }
}