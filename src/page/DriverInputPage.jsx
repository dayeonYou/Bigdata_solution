import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Form } from "react-bootstrap";
import CustomButton from "../component/common/CustomButton";
import { Flex } from "../style/Flex";

const DriverInputPage = () => {
  const [photoUrl, setPhotoUrl] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [expectedRoute, setExpectedRoute] = useState("");
  const [completed, setCompleted] = useState(false);
  const [timestamp, setTimestamp] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/driver", {
        user_id: 1, // 하드코딩된 user_id를 동적으로 처리할 수 있음
        post_cleaning_photo_url: photoUrl,
        dropoff_location: dropoffLocation,
        expected_route: expectedRoute,
        completed: completed,
        timestamp: timestamp,
      });

      if (response.data.status === "success") {
        console.log("Driver mode data submitted", response.data.driver_id);
      }
    } catch (error) {
      console.error("Error submitting driver mode data", error);
    }
  };

  return (
    <Flex>
      <Container>
        <Form onSubmit={handleFormSubmit}>
          <Form.Label>Post-Cleaning Photo URL</Form.Label>
          <Form.Group>
            <InputField
              type="text"
              placeholder="Enter photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </Form.Group>

          <Form.Label>Dropoff Location</Form.Label>
          <Form.Group>
            <InputField
              type="text"
              placeholder="Enter dropoff location"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
          </Form.Group>

          <Form.Label>수거량 (kg)</Form.Label>
          <Form.Group>
            <InputField
              type="text"
              placeholder="Enter expected route"
              value={expectedRoute}
              onChange={(e) => setExpectedRoute(e.target.value)}
            />
          </Form.Group>

          <Form.Label>시간</Form.Label>
          <Form.Group>
            <InputField
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </Form.Group>

          <CheckboxContainer>
            <Form.Label>Completed</Form.Label>
            <Form.Check
              type="checkbox"
              label="Is the task completed?"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
          </CheckboxContainer>

          <CustomButton backgroundColor="custom" type="submit">
            Submit
          </CustomButton>
        </Form>
      </Container>
    </Flex>
  );
};

export default DriverInputPage;
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
  border: 1px solid rgba(10, 175, 222, 0.5); /* 투명도 50% */
`;

const CheckboxContainer = styled.div`
  margin-bottom: 15px;
`;

// 새로운 스타일 컴포넌트로 폰트 설정
const ModeName = styled.div`
  font-family: "KotraHope"; /* 원하는 폰트로 변경 */
  font-size: 24px;
  color: #0573ac;
  margin-bottom: 5px;
  letter-spacing: 0.08em; /* 글자 간격을 조금 넓힘 */
`;

const ModeInfo = styled.div`
  font-size: 12px;
  color: grey;
`;
