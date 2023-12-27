import { dark } from "./dark";
import { light } from "./light";
import { css, CSSProp, DefaultTheme } from "styled-components";

interface Sizes {
  mobile: number;
  tablet: number;
  desktop: number;
}

type BackQuoteArgs = [TemplateStringsArray];

interface Media {
  mobile: (...args: BackQuoteArgs) => CSSProp | undefined;
  tablet: (...args: BackQuoteArgs) => CSSProp | undefined;
  desktop: (...args: BackQuoteArgs) => CSSProp | undefined;
}

const sizes: Sizes = {
  mobile: 320,
  tablet: 786,
  desktop: 1024,
};

const media: Media = {
  mobile: (...args: BackQuoteArgs) => undefined,
  tablet: (...args: BackQuoteArgs) => undefined,
  desktop: (...args: BackQuoteArgs) => undefined,
};

Object.keys(sizes).reduce((acc, label) => {
  switch (label) {
    case "desktop":
      acc.desktop = (...args: BackQuoteArgs) =>
        css`
          @media only screen and (min-width: ${sizes.desktop}px) {
            ${args}
          }
        `;
      break;
    case "tablet":
      acc.tablet = (...args: BackQuoteArgs) =>
        css`
          @media only screen and (max-width: ${sizes.desktop}px) and (min-width: ${sizes.tablet}px) {
            ${args}
          }
        `;
      break;
    case "mobile":
      acc.mobile = (...args: BackQuoteArgs) =>
        css`
          @media only screen and (max-width: ${sizes.tablet-1}px) {
            ${args}
          }
        `;
      break;
    default:
      break;
  }
  return acc;
}, media);

type Theme = (themeName: string) => DefaultTheme;

export const theme: Theme = (themeName: string) => {
  const colors = themeName === "dark" ? dark : light;
  return {
    sizes,
    colors,
    borderRadius: "4px",
    media,
  };
};
