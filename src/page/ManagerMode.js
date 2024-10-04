import React, { useState } from "react";
import styled from "styled-components";
import { Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import CustomButton from "../component/common/CustomButton";
import { Flex } from "../style/Flex";
import DatePicker from "react-datepicker"; // react-datepicker import
import "react-datepicker/dist/react-datepicker.css"; // react-datepicker 스타일 import

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
  const [startDate, setStartDate] = useState(null); // react-datepicker에서는 날짜 형식이 객체임
  const [endDate, setEndDate] = useState(null);
  const [logId, setLogId] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // 관리자 조회 처리
  const handleQuery = async (event) => {
    event.preventDefault();

    // 유효성 검사
    if (!startDate || !endDate) {
      setErrorMessage("Please enter both start and end dates.");
      return;
    }

    setErrorMessage(null); // 에러 초기화

    try {
      const response = await axios.get("/api/management", {
        params: {
          start_date: startDate.toISOString().split("T")[0], // 날짜 포맷 조정
          end_date: endDate.toISOString().split("T")[0],
        },
      });

      if (response.data) {
        setLogId(response.data.log_id);
        setFileUrl(response.data.results_file_url);
        setDownloadStatus(response.data.download_status);
      }
    } catch (error) {
      console.error("Error querying management data:", error);
      setErrorMessage("Failed to fetch data. Please try again.");
    }
  };

  // 관리자 다운로드 처리
  const handleDownload = async () => {
    if (!logId) {
      setErrorMessage("Log ID is not available.");
      return;
    }

    try {
      const response = await axios.post("/api/management/download", {
        log_id: logId,
      });

      if (response.data && response.data.status === "success") {
        window.open(response.data.file_url, "_blank");
      }
    } catch (error) {
      console.error("Error downloading the file:", error);
      setErrorMessage("Failed to download the file. Please try again.");
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
          >
            Query Data
          </CustomButton>
        </Form>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {logId && (
          <div>
            <p>
              <strong>Log ID:</strong> {logId}
            </p>
            <p>
              <strong>File URL:</strong> <a href={fileUrl}>{fileUrl}</a>
            </p>
            <p>
              <strong>Download Status:</strong> {downloadStatus}
            </p>
            <CustomButton
              backgroundColor="success"
              onClick={handleDownload}
              style={{
                marginBottom: "30px",
                width: "150px",
                height: "40px",
                borderRadius: "8px",
              }}
            >
              Download File
            </CustomButton>
          </div>
        )}
      </Container>
    </Flex>
  );
};

export default ManagerMode;
