import { styled } from "@stitches/react";
import { Flex } from "../style/Flex";
export default function ModeUnitBox({
  mode,
  iconPath,
  alt,
  handleModeClick,
  index,
}) {
  return (
    <ModeUnitBoxWrap onClick={() => handleModeClick(mode)}>
      <Flex style={{ marginTop: "20px" }}>
        <IconImage alt={alt} src={iconPath} />
        <ModeText>{mode}</ModeText>
      </Flex>
    </ModeUnitBoxWrap>
  );
}

const IconImage = styled("img", {
  width: "50px",
  height: "50px",
  objectFit: "contain",
});

const ModeUnitBoxWrap = styled("div", {
  display: "flex", // Flexbox 사용
  alignItems: "center", // 수직 중앙 정렬
  justifyContent: "center", // 왼쪽 정렬
  backgroundColor: "#F6F7F8",
  borderRadius: "10px",
  //padding: "15px", // 패딩 설정

  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s, box-shadow 0.3s",
  boxSizing: "border-box", // 패딩과 보더를 포함한 크기를 설정

  "&:hover": {
    backgroundColor: "#E0E0E0",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  },

  // 필요한 경우 여기에 추가 스타일을 작성합니다
});

// 텍스트 스타일 추가
const ModeText = styled("span", {
  marginLeft: "10px", // 아이콘과 텍스트 간격
  fontSize: "16px",
  color: "#333", // 텍스트 색상
  fontWeight: "bolder",
  lineHeight: "70px", // 텍스트를 수직 중앙 정렬하기 위해 lineHeight 설정
});
