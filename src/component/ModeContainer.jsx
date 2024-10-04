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
        navigate("/app/check");
        console.log(mode);
        break;
      case "관리자 모드":
        navigate("/app/manager");
        console.log(mode);
        break;
      case "청소 모드":
        navigate("/app/cleaner");
        console.log(mode);
        break;
      case "운전자 모드":
        navigate("/app/driver");
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
  display: "grid", // 그리드 레이아웃으로 변경
  gridTemplateColumns: "repeat(2, 1fr)", // 기본적으로 2열 그리드 설정
  gap: "30px", // 아이템 간격 추가
  maxWidth: "800px", // 최대 너비 제한

  // 반응형 스타일
  "@media (max-width: 480px)": {
    gridTemplateColumns: "repeat(2, 1fr)", // 모바일에서도 2열 그리드 유지
  },

  "@media (min-width: 481px) and (max-width: 768px)": {
    gridTemplateColumns: "repeat(2, 1fr)", // 태블릿에서도 2열 그리드
  },

  "@media (min-width: 769px)": {
    gridTemplateColumns: "repeat(2, 1fr)", // 데스크톱에서도 2열 그리드
  },
});
