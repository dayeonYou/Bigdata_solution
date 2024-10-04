import { Box, Section, Container } from "@radix-ui/themes";
import { styled } from "@stitches/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Flex } from "../../style/Flex";
import KIOSTLogo from "../../assets/icon/KIOST.svg"; // KIOST 로고 이미지 가져오기

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  // 로그인 상태를 체크하는 useEffect
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
  }, []);

  // 로고 클릭 핸들러
  const handleLogoClick = () => {
    navigate("/");
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    setIsLoggedIn(false); // 로그인 상태 업데이트
    navigate("/"); // 로그아웃 후 메인 페이지로 이동
  };

  // 로그인 핸들러
  const handleLogin = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <HeaderWrap>
      <HeaderSection justifyContent="flex-start">
        {/* 로고 이미지 추가 */}
        <LogoImg src={KIOSTLogo} alt="KIOST Logo" onClick={handleLogoClick} />
      </HeaderSection>
      <HeaderSection justifyContent="flex-end">
        {isLoggedIn ? (
          <>
            <HeaderText onClick={handleLogout}>로그아웃</HeaderText>
            <HeaderText>마이페이지</HeaderText>
          </>
        ) : (
          <>
            <HeaderText onClick={handleLogin}>로그인</HeaderText>
          </>
        )}
      </HeaderSection>
    </HeaderWrap>
  );
}

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

const MainLayout = () => {
  return (
    <Box height={"100%"}>
      <Flex direction={"column"} height={"100%"}>
        <Header />
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
