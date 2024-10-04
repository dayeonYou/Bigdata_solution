import { styled } from "@stitches/react";

export default function ModeUnitBox({
  mode,
  iconPath,
  alt,
  handleModeClick,
  index,
}) {
  return (
    <ModeUnitBoxWrap onClick={() => handleModeClick(mode)}>
      {index % 2 === 0 ? ( // 짝수 인덱스: 텍스트 먼저
        <>
          <ModeText>{mode}</ModeText>
          <IconImage alt={alt} src={iconPath} />
        </>
      ) : (
        // 홀수 인덱스: 아이콘 먼저
        <>
          <IconImage alt={alt} src={iconPath} />
          <ModeText>{mode}</ModeText>
        </>
      )}
    </ModeUnitBoxWrap>
  );
}

const IconImage = styled("img", {
  width: "50px",
  height: "50px",
  objectFit: "contain",
  marginRight: "20px",
});

const ModeUnitBoxWrap = styled("div", {
  display: "flex", // Flexbox 사용
  alignItems: "center", // 수직 중앙 정렬
  justifyContent: "start", // 왼쪽 정렬
  backgroundColor: "#F6F7F8",
  borderRadius: "10px",
  padding: "15px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s, box-shadow 0.3s",
  width: "100%", // 너비를 100%로 설정하여 박스가 확장되도록 함
  boxSizing: "border-box", // 패딩과 보더를 포함한 크기를 설정

  "&:hover": {
    backgroundColor: "#E0E0E0",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  },

  "@media (max-width: 480px)": {
    padding: "10px",
  },
});

// 텍스트 스타일 추가
const ModeText = styled("span", {
  marginLeft: "10px", // 아이콘과 텍스트 간격
  fontSize: "16px",
  color: "#333", // 텍스트 색상
  fontWeight: "bolder",
});
