import React, { useState } from "react";
import styled from "styled-components";
import { FaExclamationCircle } from "react-icons/fa"; // 느낌표 아이콘 import
import CustomButton from "../../component/common/CustomButton";
import DriverIcon from "../../assets/icon/DriverIcon.svg";
import { Modal, Button } from "react-bootstrap"; // react-bootstrap의 모달과 버튼 컴포넌트 import

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column; /* 세로 방향으로 나열 */
  justify-content: center; /* 세로 가운데 정렬 */
  align-items: center; /* 가로 가운데 정렬 */
  height: 100vh; /* 전체 화면 높이 */
`;

const Icon = styled.img`
  width: 80px; /* 아이콘 너비 */
  height: 80px; /* 아이콘 높이 */
  margin-bottom: 20px; /* 아래 여백 */
  cursor: pointer; /* 마우스를 올렸을 때 커서 모양 변경 */
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center; /* 수평 중앙 정렬 */
`;

const AlertIconStyled = styled(FaExclamationCircle)`
  width: 20px; /* 아이콘 너비 */
  height: 20px; /* 아이콘 높이 */
  margin-left: 10px; /* 제목과의 간격 */
  color: grey; /* 아이콘 색상 */
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

const DriverInfoPage = () => {
  const [showModal, setShowModal] = useState(false); // 모달 상태 관리

  // 모달 열기 및 닫기 함수
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <Container>
      <Icon src={DriverIcon} alt="Manager Mode Icon" />
      <TitleContainer>
        <Title>운전자 모드란?</Title>
      </TitleContainer>
      <Description>
        운전자모드는 청소 장소의 수거위치와 수거 양을 표시해요.
        <br />
        운전자는 수거할 장소로 이동 후, 완료 버튼을 눌러 수거를 완료할 수
        있습니다. 수거 완료 시 해당 정보는 목록에서 사라지며, 운반 일시 등의
        정보가 자동으로 입력됩니다.
      </Description>

      <CustomButton
        to="/app/driver/form"
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

export default DriverInfoPage;
