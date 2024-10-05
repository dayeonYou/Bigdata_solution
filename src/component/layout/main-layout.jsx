import { Box, Section, Container } from "@radix-ui/themes";
import { styled } from "@stitches/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation 추가
import { Outlet } from "react-router-dom";
import { Flex } from "../../style/Flex";
import KIOSTLogo from "../../assets/icon/KIOST.svg"; // KIOST 로고 이미지 가져오기

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("token"); // 토큰 삭제
      localStorage.removeItem("username"); // 저장된 이름 삭제
      setIsLoggedIn(false); // 로그인 상태 업데이트
      navigate("/"); // 로그아웃 후 로그인 페이지로 이동
    }
  };

  return (
    <HeaderWrap>
      <HeaderSection justifyContent="flex-start">
        <LogoImg
          src={KIOSTLogo}
          alt="KIOST Logo"
          onClick={() => navigate("/app/main")}
        />
      </HeaderSection>
      <HeaderSection justifyContent="flex-end">
        {isLoggedIn ? (
          <HeaderText onClick={handleLogout}>로그아웃</HeaderText>
        ) : (
          <HeaderText onClick={() => navigate("/app/login")}>로그인</HeaderText>
        )}
      </HeaderSection>
    </HeaderWrap>
  );
}

export default Header;

const Content = ({ children }) => {
  return (
    <Box flexGrow={"1"} style={{ background: "var(--gray-a2)" }}>
      <Container maxWidth={"1400px"}>
        <Section height={"100vh"} style={{ background: "var(--indigo-6)" }}>
          {children}
        </Section>
      </Container>
    </Box>
  );
};

// MainLayout 컴포넌트 수정: 로그인 페이지에서는 Header를 숨김
const MainLayout = () => {
  const location = useLocation(); // 현재 경로를 가져옴

  return (
    <Box height={"100%"}>
      <Flex direction={"column"} height={"100%"}>
        {/* 로그인 페이지가 아니면 Header를 보여줌 */}
        {location.pathname !== "/app/login" && <Header />}
        <Content>
          <Outlet />
        </Content>
      </Flex>
    </Box>
  );
};

export { MainLayout };

// 스타일링 코드
const HeaderWrap = styled("div", {
  display: "flex",
  width: "80%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "30px",
  padding: "0 20px",
});

const HeaderSection = styled("div", {
  display: "flex",
  alignItems: "center",
  variants: {
    justifyContent: {
      "flex-start": {
        justifyContent: "flex-start",
      },
      "flex-end": {
        justifyContent: "flex-end",
      },
    },
  },
  width: "50%",
});

const HeaderText = styled("div", {
  color: "#212121",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  marginLeft: "20px",
});

const LogoImg = styled("img", {
  width: "120px", // 로고 이미지 크기 조정
  cursor: "pointer", // 클릭할 수 있도록 포인터 설정
});
