import React, { useState } from "react";
import styled from "styled-components";
import { Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import CustomButton from "../component/common/CustomButton";
import { Flex } from "../style/Flex";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const DatePickerField = styled(DatePicker)`
  font-family: "Pretendard";
  margin-bottom: 25px;
  margin-top: 10px;
  width: 100%;
  height: 40px;
  border: 1px solid rgba(10, 175, 222, 0.5);
  padding: 5px 10px;
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

const ManagerMode = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleQuery = async (event) => {
    event.preventDefault();

    // 유효성 검사
    if (!startDate || !endDate) {
      setErrorMessage("Please enter both start and end dates.");
      return;
    }

    setErrorMessage(null); // 에러 초기화

    try {
      const response = await axios.get(
        "http://10.30.0.179:8080/api/management/export-investigation",
        {
          params: {
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        // blob으로 응답받은 파일들을 처리
        const formData = new FormData();

        const data = response.data; // 서버에서 받은 Blob 데이터
        const fileNames = [
          "coastline_histogram.png",
          "prediction_histogram.png",
          "waste_prediction_map.html",
          "waste_map.html",
        ];

        // Blob 데이터를 각 파일 이름으로 저장
        for (let i = 0; i < fileNames.length; i++) {
          formData.append(fileNames[i], new Blob([data]), fileNames[i]);
        }

        // 파일 다운로드
        fileNames.forEach((fileName) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 링크 제거
        });
      }
    } catch (error) {
      console.error("Error querying management data:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        setErrorMessage(`Error: ${error.response.data}`);
      } else if (error.request) {
        console.error("Request error:", error.request);
        setErrorMessage("No response received from the server.");
      } else {
        console.error("Error message:", error.message);
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <Flex>
      <ModeName>관리자 모드</ModeName>
      <ModeInfo>Data Management</ModeInfo>
      <Container>
        <Form onSubmit={handleQuery}>
          <Form.Label>Start Date</Form.Label>
          <Form.Group>
            <DatePickerField
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
            />
          </Form.Group>

          <Form.Label>End Date</Form.Label>
          <Form.Group>
            <DatePickerField
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
            />
          </Form.Group>

          <CustomButton
            backgroundColor="custom"
            custom="#0573AC"
            type="submit"
            style={{
              marginBottom: "20px",
              width: "150px",
              height: "40px",
              borderRadius: "8px",
            }}
            onClick={handleQuery}
          >
            Query Data
          </CustomButton>
        </Form>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      </Container>
    </Flex>
  );
};

export default ManagerMode;
