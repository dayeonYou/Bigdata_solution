import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 import
import CustomButton from "../component/common/CustomButton";
import { Flex } from "../style/Flex";

// **스타일 컴포넌트**
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 600px;
  background-color: white;
`;

const Label = styled(Form.Label)`
  font-weight: bold;
  font-family: "Pretendard";
`;

const InputField = styled(Form.Control)`
  font-family: "Pretendard";
  margin: 10px 0 25px 0;
  height: 40px;
  border: 1px solid rgba(10, 175, 222, 0.5);
`;

const CheckboxContainer = styled.div`
  margin-bottom: 15px;
`;

const ModeName = styled.div`
  font-family: "KotraHope";
  font-size: 40px;
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

const InvestigationInput = () => {
  // **상태 관리**
  const [formData, setFormData] = useState({
    username: "Kim chulsu",
    coast_name: "",
    length: "",
    pollution_level: "",
    waste_type: "",
    photo_url: "http://example.com/photo.jpg",
    timestamp: "",
    latitude: "",
    longitude: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  // **일시와 위도/경도 자동 등록**
  useEffect(() => {
    const currentDate = new Date().toISOString();
    setFormData((prevData) => ({ ...prevData, timestamp: currentDate }));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
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

  // **쓰레기 종류 및 오염도 변경 핸들러**
  const handleTrashSelection = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({ ...prevData, waste_type: value }));
  };

  const handlePollutionLevelChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({ ...prevData, pollution_level: value }));
  };

  // **제출 핸들러**
  const handleSubmit = async (event) => {
    event.preventDefault();

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
          waste_type: parseInt(formData.waste_type), // INT로 변환하여 전송
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 서버 응답 확인
      if (response.data.status === "success") {
        alert(`Investigation submitted! ID: ${response.data.investigation_id}`);
        navigate("/app/main"); // 제출 성공 시 /app/main으로 이동
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

  // **주요 쓰레기 종류**
  const trashTypes = [
    { type: "페어구류", example: "(그물, 밧줄, 양식 자재 등)", value: 1 },
    { type: "부포류", example: "(스티로폼 부표, 인증 부표 등)", value: 2 },
    {
      type: "생활쓰레기류",
      example: "(음료수병, 포장비닐, 과자봉지, 캔 등)",
      value: 3,
    },
    { type: "대형 투기쓰레기류", example: "(가전제품, 타이어 등)", value: 4 },
    { type: "초목류", example: "(자연목, 인공목 등)", value: 5 },
  ];

  return (
    <Flex>
      <ModeName>바다환경지킴이 모드</ModeName>

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
          <Label>해안길이(m)</Label>
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
                  margin: "20px 0 30px 0",
                  width: "150px",
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                사진 촬영
              </CustomButton>
            </Form.Group>
          </Form.Group>
          <Label>오염 정도 평가</Label>
          <Form.Group>
            <Form.Control
              as="select"
              value={formData.pollution_level}
              onChange={handlePollutionLevelChange}
            >
              <option value="">선택하세요</option>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </Form.Control>
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

          <Label>쓰레기 종류</Label>
          <CheckboxContainer>
            {trashTypes.map((trash) => (
              <Form.Check
                key={trash.value}
                type="radio"
                label={
                  <>
                    <strong>{trash.type}</strong> {trash.example}
                  </>
                }
                value={trash.value}
                checked={formData.waste_type === trash.value.toString()} // String으로 비교
                onChange={handleTrashSelection}
              />
            ))}
          </CheckboxContainer>

          <CustomButton
            to="/app/main"
            type="submit"
            backgroundColor="custom"
            custom="#007BFF"
            style={{
              marginTop: "20px",
              width: "100%",
              height: "40px",
              borderRadius: "8px",
            }}
          >
            제출하기
          </CustomButton>
        </Form>
      </Container>
    </Flex>
  );
};

export default InvestigationInput;
