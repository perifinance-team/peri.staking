// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      backgroundColor: {
        body: string,
        panel: string,
      },
      border: string,
      font: {
        primary: string,
        secondary: string,
      },
      button: string,
      hover: {
          button: string,
          background: string
      },
    };
    
    fontFamilies: {
      regular: string,
      medium: string,
      bold: string
    }
  }
}