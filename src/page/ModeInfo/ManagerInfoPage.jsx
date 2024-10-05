import React from "react";
import styled from "styled-components";
import CustomButton from "../../component/common/CustomButton";
import ManagerIcon from "../../assets/icon/ManagerIcon.svg"; // 아이콘 경로 import

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column; /* 세로 방향으로 나열 */
  justify-content: center; /* 세로 가운데 정렬 */
  align-items: center; /* 가로 가운데 정렬 */
  height: 100vh; /* 전체 화면 높이 */
`;

const Icon = styled.img`
  width: 100px; /* 아이콘 너비 */
  height: 100px; /* 아이콘 높이 */
  //margin-bottom: 20px; /* 아래 여백 */
`;

const Title = styled.h2`
  margin: 0; /* 제목 여백 제거 */
  font-family: "KotraHope"; /* 폰트 설정 */
  font-size: 30px;
  margin-bottom: 20px;
  color: #0573ac;
`;

const Description = styled.p`
  text-align: center; /* 텍스트 중앙 정렬 */
  margin: 0 20px; /* 양쪽 여백 */
  font-size: 15px; /* 글자 크기 */
  color: #555; /* 글자 색 */
`;

const ManagerInfoPage = () => {
  return (
    <Container>
      <Icon src={ManagerIcon} alt="Manager Mode Icon" /> {/* 아이콘 적용 */}
      <Title>관리자 모드란?</Title>
      <Description>
        관리자 모드는 조사모드와 청소모드에서 기록한 정보를
        <br />
        확인하는 모드입니다.
        <br />
        이곳에서 쓰레기 수거 및 환경 보호를 위한 다양한 작업을
        <br />
        진행해요
      </Description>
      <CustomButton
        to="/app/manager/form" // 버튼 클릭 시 이동할 경로 설정
        style={{
          marginTop: "20px", // 위 여백
          width: "150px", // 버튼 너비
          height: "40px", // 버튼 높이
          borderRadius: "8px", // 둥글기 정도
        }}
      >
        들어가기
      </CustomButton>
    </Container>
  );
};

export default ManagerInfoPage;
