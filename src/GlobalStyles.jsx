import { createGlobalStyle } from "styled-components";
import Pretendard from "./assets/fonts/Pretendard-Regular.woff";
import PoetsenOne from "./assets/fonts/PoetsenOne-Regular.ttf";
import KotraHope from "./assets/fonts/KOTRAHOPE.ttf";
import OleoScriptSwashCapsBold from "./assets/fonts/OleoScriptSwashCaps-Bold.ttf";
import OleoScriptSwashCapsRegular from "./assets/fonts/OleoScriptSwashCaps-Regular.ttf";

const GlobalStyle = createGlobalStyle`
@font-face { 
  font-family: "Pretendard";
  src: url(${Pretendard}) format("woff");
}
@font-face {
  font-family: "PoetsenOne";
  font-weight: normal;
  src: url(${PoetsenOne}) format("truetype");
}
@font-face {
  font-family: "PoetsenOne";
  font-weight: normal;
  src: url(${PoetsenOne}) format("truetype");
}

@font-face {
  font-family: "KotraHope";
  font-weight: normal;
  src: url(${KotraHope}) format("truetype");
}
@font-face {
  font-family: "OleoScriptSwashCapsBold";
  font-weight: normal;
  src: url(${OleoScriptSwashCapsBold}) format("truetype");
}

@font-face {
  font-family: "OleoScriptSwashCapsRegular";
  font-weight: normal;
  src: url(${OleoScriptSwashCapsRegular}) format("truetype");
}

body {
    font-family: 'Pretendard';
    margin: 0;
    font-size: 16px;
    background-color: #FAFAFA; /* 기존의 배경색 */
    background:  #FAFAFA;
    min-height: 100vh;
    overflow-x: hidden;
}

.wrap {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background-color: transparent; /* wrap 내부는 투명하게 유지 */
}

.start {
  opacity: 0;
}

.end {
  opacity: 1;
  transition : opacity 5s;
}
`;

export default GlobalStyle;
