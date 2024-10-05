import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useNavigate, Route, Routes } from "react-router-dom"; // react-router-dom 사용
import { Flex } from "../style/Flex"; // Flex 스타일 경로 확인
import styled from "styled-components";

// 각 페이지 컴포넌트 import

import CollectMode from "../component/CollectMode";

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 600px;
  background-color: white;
  margin-bottom: 20px;
  margin-top: 50px;
`;
const ModeName = styled.div`
  font-family: "KotraHope"; /* 원하는 폰트로 변경 */
  font-size: 50px;
  color: #0573ac;
  margin-bottom: 5px;
  letter-spacing: 0.08em; /* 글자 간격을 조금 넓힘 */
`;

const ModeInfo = styled.div`
  font-size: 12px;
  color: grey;
`;

const StyledTabs = styled(Tabs)`
  border: none; /* 기본 테두리 제거 */
  margin-top: 20px; /* 탭과 제목 간의 간격 추가 */
`;

const StyledTab = styled(Tab)`
  &.nav-tabs .nav-link {
    border: none; /* 기본 테두리 제거 */
    border-radius: 0.5rem; /* 모서리 둥글게 */
    background-color: #f8f9fa; /* 배경 색상 */
    color: #6c757d; /* 탭 글자 색상 */
    margin-right: 10px; /* 탭 간 간격 */
    padding: 10px 20px; /* 탭의 패딩 */
    transition: background-color 0.3s ease; /* 부드러운 배경 전환 효과 */

    &:hover {
      background-color: #e2e6ea; /* 호버 시 배경 색상 */
    }
  }

  &.nav-tabs .nav-link.active {
    background-color: #0573ac; /* 선택된 탭 배경 색상 */
    color: white; /* 선택된 탭 글자 색상 */
  }
`;

const DriverModePage = () => {
  const navigate = useNavigate();

  const handleSelect = (eventKey) => {
    navigate(eventKey); // 탭 선택 시 해당 경로로 이동
  };

  return (
    <Flex>
      <>
        <ModeName>운전자 모드</ModeName>
      </>
      <Container>
        <CollectMode />
      </Container>
    </Flex>
  );
};

export default DriverModePage;
