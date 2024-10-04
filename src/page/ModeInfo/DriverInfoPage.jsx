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
      <Icon src={DriverIcon} alt="Manager Mode Icon" />{" "}
      {/* 아이콘 클릭 시 모달 열기 */}
      <TitleContainer>
        <Title>운전자 모드란?</Title>
      </TitleContainer>
      <Description>
        운전자 모드는 수거 차량 운전자가 쉽게 사용할 수 있는 기능입니다. 이
        모드를 통해 청소 후 수거 장소를 지도에서 확인하고, 예상되는 운송량과
        이동 경로를 직관적으로 확인할 수 있습니다. 경로를 수정할 수도 있으며,
        쓰레기를 탑재한 후 완료 버튼을 누르면 해당 장소가 자동으로 목록에서
        사라져 편리하게 관리할 수 있습니다.
      </Description>
      <AlertIconStyled onClick={handleShow} /> {/* 느낌표 아이콘 */}
      <CustomButton
        to="/app/driver/form" // 버튼 클릭 시 이동할 경로 설정
        style={{
          marginTop: "20px", // 위 여백
          width: "150px", // 버튼 너비
          height: "40px", // 버튼 높이
          borderRadius: "8px", // 둥글기 정도
        }}
      >
        들어가기
      </CustomButton>
      {/* 모달 컴포넌트 */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>운전자 모드 자세히 보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          운전자 모드는 수거 차량 운전자가 쉽게 사용할 수 있는 기능입니다.
          <br />
          이 모드를 통해 청소 후 수거 장소를 지도에서 확인하고, 예상되는
          운송량과 이동 경로를 직관적으로 확인할 수 있습니다.
          <br />
          경로를 수정할 수도 있으며, 쓰레기를 탑재한 후 완료 버튼을 누르면 해당
          장소가 자동으로 목록에서 사라져 편리하게 관리할 수 있습니다.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DriverInfoPage;
