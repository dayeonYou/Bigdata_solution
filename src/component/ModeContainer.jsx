import { styled } from "@stitches/react";

import MapIcon from "../assets/icon/map.svg";
import CleanerIcon from "../assets/icon/CleanerIcon.svg";
import ManagerIcon from "../assets/icon/ManagerIcon.svg";
import DriverIcon from "../assets/icon/DriverIcon.svg";
import { Flex } from "../style/Flex";
import { useNavigate } from "react-router-dom";
import ModeUnitBox from "./ModeBox";

export default function ModeContainer() {
  const navigate = useNavigate();

  function handleModeClick(mode) {
    switch (mode) {
      case "조사 모드":
        navigate("/check");
        console.log(mode);
        break;
      case "관리자 모드":
        navigate("/manager");
        console.log(mode);
        break;
      case "청소 모드":
        navigate("/cleaner");
        console.log(mode);
        break;
      case "운전자 모드":
        navigate("/driver");
        console.log(mode);
        break;
      default:
        console.log(`Unhandled case: ${mode}`);
    }
  }

  return (
    <ModeContainerWrap>
      <ModeUnitBox
        mode="조사 모드"
        alt="아이콘 정보"
        iconPath={MapIcon}
        handleModeClick={handleModeClick}
      />
      <ModeUnitBox
        mode="관리자 모드"
        alt="아이콘 정보"
        iconPath={ManagerIcon}
        handleModeClick={handleModeClick}
      />
      <ModeUnitBox
        mode="청소 모드"
        alt="아이콘 정보"
        iconPath={CleanerIcon}
        handleModeClick={handleModeClick}
      />
      <ModeUnitBox
        mode="운전자 모드"
        alt="아이콘 정보"
        iconPath={DriverIcon}
        handleModeClick={handleModeClick}
      />
    </ModeContainerWrap>
  );
}

const ModeContainerWrap = styled(Flex, {
  marginTop: "20px",
  cursor: "pointer",
  gap: "20px", // 아이템 간격 추가
  flexWrap: "wrap", // 아이템이 넘칠 경우 줄 바꿈
  maxWidth: "800px", // 최대 너비 제한

  // 반응형 스타일
  "@media (max-width: 480px)": {
    flexDirection: "column", // 모바일에서는 세로 정렬
    alignItems: "center",
  },

  "@media (min-width: 481px) and (max-width: 768px)": {
    flexDirection: "row", // 태블릿에서는 가로 정렬
    justifyContent: "space-between",
  },

  "@media (min-width: 769px)": {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
