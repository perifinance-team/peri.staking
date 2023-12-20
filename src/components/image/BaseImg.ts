import styled from "styled-components";

export const BaseImg = styled.img<{ $height?: number,  $width?: number, $margin?: string, $justifyC?: string, $rounded?: number }>`
  display: flex;
  width: ${props => props.$width ? `${props.$width}px` : 'auto'};
  height: ${props => props.$height ? `${props.$height}px` : 'auto'};
  margin: ${props => props.$margin ? `${props.$margin}` : "0px 3px 0px 3px"};
  justify-content: ${props => props.$justifyC ? `${props.$justifyC}` : "center"};
  border-radius: ${props => props.$rounded ? `${props.$rounded}px` : "0px"};
`;