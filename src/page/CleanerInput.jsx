import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Form } from "react-bootstrap";
import CustomButton from "../component/common/CustomButton";
import { Flex } from "../style/Flex";

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

const InputField = styled(Form.Control)`
  font-family: "Pretendard";
  margin-bottom: 25px;
  margin-top: 10px;
  width: 100%;
  height: 40px;
  border: 1px solid rgba(10, 175, 222, 0.5);
`;

const Label = styled(Form.Label)`
  font-weight: bold; /* 제목을 굵게 스타일 */
  font-family: "Pretendard";
`;

const CheckboxContainer = styled.div`
  margin-bottom: 15px;
`;

const ModeName = styled.div`
  font-family: "KotraHope";
  font-size: 24px;
  color: #0573ac;
  margin-bottom: 5px;
  letter-spacing: 0.08em;
`;

const ModeInfo = styled.div`
  font-size: 12px;
  color: grey;
`;

const PhotoPreview = styled.img`
  margin-top: 10px;
  max-width: 100%;
  height: auto;
`;

const DefaultImageContainer = styled.div`
  margin-top: 10px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: #e0e0e0;
  color: #777;
  font-size: 16px;
  border-radius: 8px;
`;

const TrashTypeLabel = styled.span`
  font-size: 12px;
  color: #999;
`;

const CleanerInput = () => {
  const [formData, setFormData] = useState({
    username: "Kim chulsu",
    coast_name: "",
    length: "",
    collected_amount: "",
    waste_type: "", // 이 값을 숫자로 변경
    photo_url: "http://example.com/photo.jpg",
    timestamp: "",
    latitude: "",
    longitude: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const currentDate = new Date().toISOString();
    setFormData((prevData) => ({ ...prevData, timestamp: currentDate }));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          latitude,
          longitude,
        }));
      });
    }
  }, []);

  const takePicture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "camera";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileURL = URL.createObjectURL(file);
        setFormData((prevData) => ({ ...prevData, photo_url: fileURL }));
        setPhotoPreview(fileURL);
      }
    };
    input.click();
  };

  // 주요 쓰레기 종류와 매핑
  const trashTypes = [
    { type: "페어구류", example: "(그물, 밧줄, 양식 자재 등)", value: 1 },
    { type: "부표류", example: "(스티로폼 부표, 인증 부표 등)", value: 2 },
    {
      type: "생활쓰레기류",
      example: "(음료수병, 포장비닐, 과자봉지, 캔 등)",
      value: 3,
    },
    { type: "대형 투기쓰레기류", example: "(가전제품, 타이어 등)", value: 4 },
    { type: "초목류", example: "(자연목, 인공목 등)", value: 5 },
  ];

  const handleTrashSelection = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({ ...prevData, waste_type: value })); // 숫자 값을 사용
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 전송할 데이터 형태를 콘솔에 출력
    const dataToSend = {
      username: formData.username,
      photo_url: formData.photo_url,
      timestamp: formData.timestamp,
      coast_name: formData.coast_name,
      length: parseFloat(formData.length),
      collected_amount: parseFloat(formData.collected_amount),
      waste_type: parseInt(formData.waste_type, 10), // 숫자형으로 변환하여 전송
      latitude: formData.latitude, // 위도 추가
      longitude: formData.longitude, // 경도 추가
    };

    console.log("Sending data to the backend:", dataToSend); // 데이터 형태 출력

    try {
      const response = await axios.post(
        "http://localhost:8080/api/investigation",
        dataToSend // 수정된 데이터 사용
      );

      if (response.data.status === "success") {
        alert(`Cleanup submitted! ID: ${response.data.cleanup_id}`);
      }
    } catch (error) {
      console.error("Error submitting the cleanup:", error);
      alert("Failed to submit the cleanup.");
    }
  };

  return (
    <Flex>
      <ModeName>바다환경 청소모드</ModeName>
      <ModeInfo>청소모드입니다! 청소 현장의 정보를 기록해요</ModeInfo>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Label>해안명</Label>
          <Form.Group>
            <InputField
              type="text"
              placeholder="Enter the name of the coast"
              value={formData.coast_name}
              onChange={(e) =>
                setFormData({ ...formData, coast_name: e.target.value })
              }
            />
          </Form.Group>
          <Label>해안길이 (km)</Label>
          <Form.Group>
            <InputField
              type="number"
              placeholder="Enter the coast length"
              value={formData.length}
              onChange={(e) =>
                setFormData({ ...formData, length: e.target.value })
              }
            />
          </Form.Group>
          <Label>사진</Label>
          <Form.Group>
            {photoPreview ? (
              <PhotoPreview src={photoPreview} alt="Preview" />
            ) : (
              <DefaultImageContainer>
                사진이 추가되지 않았습니다
              </DefaultImageContainer>
            )}
            <Form.Group style={{ display: "flex", justifyContent: "center" }}>
              <CustomButton
                backgroundColor="custom"
                custom="#FF6347"
                onClick={takePicture}
                style={{
                  marginBottom: "30px",
                  marginTop: "20px",
                  width: "150px",
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                Take Picture
              </CustomButton>
            </Form.Group>
          </Form.Group>
          <Label>수거량 (kg)</Label>
          <Form.Group>
            <InputField
              type="number"
              placeholder="Enter the amount collected"
              value={formData.collected_amount}
              onChange={(e) =>
                setFormData({ ...formData, collected_amount: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Label>일시</Label>
            <InputField type="text" value={formData.timestamp} readOnly />
          </Form.Group>

          {/* 위도와 경도를 별도로 표시 */}
          <Form.Group>
            <Label>위도</Label>
            <InputField type="text" value={formData.latitude} readOnly />
          </Form.Group>
          <Form.Group>
            <Label>경도</Label>
            <InputField type="text" value={formData.longitude} readOnly />
          </Form.Group>

          <CheckboxContainer>
            <Label>주요 쓰레기 종류</Label>
            {trashTypes.map((trash, index) => (
              <Form.Check
                key={index}
                type="radio"
                label={
                  <>
                    {trash.type}
                    <TrashTypeLabel> {trash.example}</TrashTypeLabel>
                  </>
                }
                value={trash.value} // 숫자 값을 사용
                name="trashType"
                onChange={handleTrashSelection}
                checked={formData.waste_type === trash.value.toString()} // 비교 시 문자열로 변환
              />
            ))}
          </CheckboxContainer>
          <CustomButton
            backgroundColor="custom"
            custom="#FF6347"
            type="submit"
            style={{
              marginTop: "20px",
              width: "150px",
              height: "40px",
              borderRadius: "8px",
            }}
            onClick={handleSubmit}
          >
            제출
          </CustomButton>
        </Form>
      </Container>
    </Flex>
  );
};

export default CleanerInput;
