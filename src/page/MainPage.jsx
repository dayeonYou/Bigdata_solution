import { useState, useEffect } from "react";
import ModeContainer from "../component/ModeContainer";
import { styled } from "@stitches/react";

export default function MainPage() {
  const [username, setUsername] = useState("");

  // 로그인된 사용자의 이름을 로컬스토리지에서 가져옴
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "Guest"); // 저장된 값이 없으면 "Guest"로 설정
  }, []);

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
  maxWidth: "1200px",
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
  fontSize: "30px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  color: "#333",
});

const Subtitle = styled("h2", {
  fontSize: "24px",
  fontWeight: "normal",
  color: "#7a7a7a",
  whiteSpace: "nowrap",
});

const ActivitySection = styled("section", {
  width: "100%",
  maxWidth: "800px",
  marginBottom: "20px",
  padding: "10px",
  boxSizing: "border-box",
  borderRadius: "8px",
  backgroundColor: "#FAFAFA",
});
