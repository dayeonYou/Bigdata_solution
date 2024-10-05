import React, { useState, useEffect } from "react"; // Import useEffect
import WasteMap from "../component/WasteMap";
import styled from "styled-components";
import BasicStatistics from "../component/BasicStatistics";
import axios from "axios"; // Import axios

const Title = styled.h1`
  text-align: center;
  margin: 2rem 0;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const MapContainer = styled.div`
  margin-bottom: 3rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.5rem;
    margin-bottom: 2rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  background-color: ${(props) => (props.active ? "#4CAF50" : "#f1f1f1")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1.2rem;

  &:hover {
    background-color: #ddd;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 8px 16px;
  }
`;

const DateInput = styled.input`
  padding: 10px;
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  margin: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const MapPage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [startDate, setStartDate] = useState("2024-10-01");
  const [endDate, setEndDate] = useState("2024-10-01");
  const [filteredData, setFilteredData] = useState([]);

  // Function to fetch data based on date range
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://10.30.0.179:8080/api/investigations/by-date",
        {
          params: {
            startDate: `${startDate}T00:00:00`, // 시작 날짜
            endDate: `${endDate}T23:59:59`, // 끝 날짜
          },
        }
      );
      setFilteredData(response.data);
      console.log("Fetched Data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle date change and fetch data
  const handleDateChange = () => {
    fetchData();
    console.log("filteredData", filteredData);
  };

  return (
    <div>
      <DateInput
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <DateInput
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <SubmitButton onClick={handleDateChange}>완료</SubmitButton>

      <TabContainer>
        <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
          수거 예측량 및 쓰레기 분포
        </Tab>
        <Tab active={activeTab === 2} onClick={() => setActiveTab(2)}>
          기초통계분석
        </Tab>
      </TabContainer>

      {activeTab === 1 && (
        <>
          <MapContainer>
            <Title>수거예측량 분포</Title>
            {filteredData.length > 0 ? (
              <WasteMap data={filteredData} />
            ) : (
              <p>수거예측량 데이터가 없습니다.</p>
            )}
          </MapContainer>
          <MapContainer>
            <Title>주요쓰레기 분포</Title>
            {filteredData.length > 0 ? (
              <WasteMap data={filteredData} />
            ) : (
              <p>주요쓰레기 데이터가 없습니다.</p>
            )}
          </MapContainer>
          {filteredData.length === 0 && <p>데이터가 없습니다.</p>}
        </>
      )}
      {activeTab === 2 && (
        <MapContainer>
          <Title>기초통계분석</Title>
          {filteredData.length > 0 ? (
            <BasicStatistics
              startDate={startDate}
              endDate={endDate}
              data={filteredData}
            />
          ) : (
            <p>기초 통계 데이터가 없습니다.</p>
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default MapPage;
