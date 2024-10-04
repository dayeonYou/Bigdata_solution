import ModeContainer from "../component/ModeContainer";
import { styled } from "@stitches/react";

import { FaTrashAlt, FaRecycle, FaMapMarkedAlt } from "react-icons/fa";

export default function MainPage() {
  return (
    <MainContainer>
      <Header>
        <Title>바다환경지킴이</Title>
        <Subtitle>빅데이터 기반 해양쓰레기 수거 솔루션</Subtitle>
      </Header>

      {/* <Introduction>
        <IntroTitle>해양 쓰레기 문제에 대한 솔루션</IntroTitle>
        <IntroCircles>
          <IntroCircle>
            <CircleContent>
              <CircleIcon>
                <FaTrashAlt size={24} color="#0077B6" />
              </CircleIcon>
              <CircleText>
                <strong>해양 쓰레기 문제</strong>
                <p>지속적인 환경 문제로 생태계에 심각한 영향을 미칩니다.</p>
              </CircleText>
            </CircleContent>
          </IntroCircle>
          <IntroCircle>
            <CircleContent>
              <CircleIcon>
                <FaRecycle size={24} color="#0096C7" />
              </CircleIcon>
              <CircleText>
                <strong>스마트 수거 솔루션</strong>
                <p>빅데이터로 효율적인 쓰레기 수거를 돕습니다.</p>
              </CircleText>
            </CircleContent>
          </IntroCircle>
          <IntroCircle>
            <CircleContent>
              <CircleIcon>
                <FaMapMarkedAlt size={24} color="#023E8A" />
              </CircleIcon>
              <CircleText>
                <strong>지속적인 관리</strong>
                <p>전국 해안가를 상시 관리하여 깨끗한 환경을 유지합니다.</p>
              </CircleText>
            </CircleContent>
          </IntroCircle>
        </IntroCircles>
      </Introduction> */}

      <ActivitySection>
        <SectionTitle>오늘의 수거 활동</SectionTitle>
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
  maxWidth: "1200px",
  margin: "0 auto",
  backgroundColor: "#F0F8FF",
});

const Header = styled("header", {
  textAlign: "center",
  marginBottom: "30px",
});

const Title = styled("h1", {
  fontSize: "36px",
  fontWeight: "bold",
  color: "#0077B6",
});

const Subtitle = styled("h2", {
  fontSize: "20px",
  color: "#0096C7",
});

const Introduction = styled("section", {
  textAlign: "center",
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#023E8A",
  maxWidth: "800px",
  marginBottom: "20px",
  padding: "10px",
});

const IntroTitle = styled("h3", {
  fontSize: "20px",
  color: "#03045E",
  marginBottom: "15px",
});

const IntroCircles = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "center",
  maxWidth: "800px",

  "@media (max-width: 768px)": {
    justifyContent: "center",
  },
});

const IntroCircle = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#E0F7FA",
  borderRadius: "50%",
  padding: "10px",
  width: "150px",
  height: "150px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s",
  margin: "10px",

  "&:hover": {
    transform: "translateY(-5px)",
  },

  "@media (max-width: 768px)": {
    width: "120px",
    height: "120px",
  },
});

const CircleContent = styled("div", {
  display: "flex",
  flexDirection: "column", // 세로 정렬로 변경
  alignItems: "center",
  textAlign: "center", // 중앙 정렬로 변경
});

const CircleIcon = styled("div", {
  marginBottom: "5px", // 아이콘과 텍스트 간의 간격 조정
});

const CircleText = styled("div", {
  "& strong": {
    fontSize: "14px", // 글씨 크기 조정
  },

  "& p": {
    marginTop: "3px", // 마진 조정
    fontSize: "12px",
    lineHeight: "1.4",

    "@media (max-width: 480px)": {
      fontSize: "10px",
    },
  },
});

const ActivitySection = styled("section", {
  width: "100%",
  maxWidth: "800px",
  marginBottom: "20px",
  padding: "10px",
  boxSizing: "border-box",
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

const SectionTitle = styled("h3", {
  fontSize: "24px",
  color: "#03045E",
  marginBottom: "20px",
  textAlign: "center",
});
