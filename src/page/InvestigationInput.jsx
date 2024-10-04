import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Form } from "react-bootstrap";
import CustomButton from "../component/common/CustomButton";
import { Flex } from "../style/Flex";

// **스타일 컴포넌트**
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
const Label = styled(Form.Label)`
  font-weight: bold; /* 제목을 굵게 스타일 */
  font-family: "Pretendard";
`;
const InputField = styled(Form.Control)`
  font-family: "Pretendard";
  margin-bottom: 25px;
  margin-top: 10px;
  width: 100%;
  height: 40px;
  border: 1px solid rgba(10, 175, 222, 0.5); /* **투명도 50%** */
`;

const CheckboxContainer = styled.div`
  margin-bottom: 15px;
`;

// **새로운 스타일 컴포넌트로 폰트 설정**
const ModeName = styled.div`
  font-family: "KotraHope"; /* **원하는 폰트로 변경** */
  font-size: 24px;
  color: #0573ac;
  margin-bottom: 5px;
  letter-spacing: 0.08em; /* **글자 간격을 조금 넓힘** */
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

const InvestigationInput = () => {
  // **상태 관리**
  const [formData, setFormData] = useState({
    username: "Kim chul su",
    coast_name: "",
    length: "",
    pollution_level: "",
    waste_type: "",
    photo_url: "http://example.com/photo.jpg", // **사진 URL이 저장될 위치**
    timestamp: "",
    latitude: "",
    longitude: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  // **일시와 위도/경도 자동 등록**
  useEffect(() => {
    const currentDate = new Date().toISOString();
    setFormData((prevData) => ({ ...prevData, timestamp: currentDate }));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          latitude: latitude.toString(), // 위도
          longitude: longitude.toString(), // 경도
        }));
      });
    }
  }, []);

  // **사진 찍기**
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

  // **주요 쓰레기 종류**
  const trashTypes = [
    { type: "페어구류", example: "(그물, 밧줄, 양식 자재 등)" },
    { type: "부포류", example: "(스티로폼 부표, 인증 부표 등)" },
    { type: "생활쓰레기류", example: "(음료수병, 포장비닐, 과자봉지, 캔 등)" },
    { type: "대형 투기쓰레기류", example: "(가전제품, 타이어 등)" },
    { type: "초목류", example: "(자연목, 인공목 등)" },
  ];

  const handleTrashSelection = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({ ...prevData, waste_type: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 데이터 확인
    console.log("Sending data:", formData);

    try {
      const response = await axios.post(
        "http://10.30.0.179:8080/api/investigation",
        {
          username: formData.username,
          photo_url: formData.photo_url,
          timestamp: formData.timestamp,
          coast_name: formData.coast_name,
          length: parseFloat(formData.length),
          pollution_level: formData.pollution_level,
          waste_type: formData.waste_type,
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.data.status === "success") {
        alert(`Investigation submitted! ID: ${response.data.investigation_id}`);
      } else {
        console.warn("Submission failed:", response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error message:", error.message);
      }
      alert("Failed to submit the investigation.");
    }
  };

  return (
    <Flex>
      <ModeName>바다환경지킴이 모드</ModeName>
      <ModeInfo>조사모드입니다! ~을 기록해요</ModeInfo>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Label>Coast Name</Label>
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
          <Label>해안길이(km)</Label>
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
          <Label>Photo</Label>
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
          <Label>오염 정도 평가</Label>
          <Form.Group>
            <InputField
              type="text"
              placeholder="Enter the pollution level"
              value={formData.pollution_level}
              onChange={(e) =>
                setFormData({ ...formData, pollution_level: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Label>일시</Label>
            <InputField type="text" value={formData.timestamp} readOnly />
          </Form.Group>

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
                value={trash.type.toLowerCase()}
                name="trashType"
                onChange={handleTrashSelection}
                checked={formData.waste_type === trash.type.toLowerCase()}
              />
            ))}
          </CheckboxContainer>
        </Form>
        <CustomButton
          backgroundColor="custom"
          type="submit"
          onClick={handleSubmit}
        >
          제출하기
        </CustomButton>
      </Container>
    </Flex>
  );
};

export default InvestigationInput;
