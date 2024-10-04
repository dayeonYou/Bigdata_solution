import { useState } from "react";
import ModeContainer from "../component/ModeContainer";
import { styled } from "@stitches/react";

export default function MainPage() {
  const [username, setUsername] = useState("김철수");

  return (
    <MainContainer>
      <Header>
        <TitleWrapper>
          <Title>{username}</Title>
          <Subtitle>님 안녕하세요!</Subtitle>
        </TitleWrapper>
        <p>모드를 선택해주세요</p>
      </Header>

      <ActivitySection>
        <ModeContainer />
      </ActivitySection>
    </MainContainer>
  );
}

const MainContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  width: "100%",
  maxWidth: "1200px", // 적절한 최대 너비로 설정
  margin: "0 auto",
});

const Header = styled("header", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "40px",
  width: "100%",
  padding: "0 20px",
});

const TitleWrapper = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "end",
  gap: "8px",
  width: "100%",
});

const Title = styled("h1", {
  fontSize: "30px", // 더 큰 글씨로 강조
  fontWeight: "bold",
  whiteSpace: "nowrap",
  color: "#333", // 텍스트 색상
});

const Subtitle = styled("h2", {
  fontSize: "24px",
  fontWeight: "normal",
  color: "#7a7a7a",
  whiteSpace: "nowrap",
});

const ActivitySection = styled("section", {
  width: "100%",
  maxWidth: "800px", // 최대 너비를 ModeContainer와 맞추기
  marginBottom: "20px",
  padding: "10px",
  boxSizing: "border-box",
  borderRadius: "8px",
  backgroundColor: "#FAFAFA", // 배경색 추가
});
