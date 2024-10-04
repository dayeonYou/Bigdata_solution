import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const FormContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 18px;
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const TransportPage = () => {
  const [transportVolume, setTransportVolume] = useState(0);
  const [expectedRoute, setExpectedRoute] = useState("");
  const [completionStatus, setCompletionStatus] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/transport", {
        driver_id: 1, // 하드코딩된 driver_id를 동적으로 처리할 수 있음
        transport_volume: transportVolume,
        expected_route: expectedRoute,
        completion_status: completionStatus,
      });

      if (response.data.status === "success") {
        console.log("Transport record created", response.data.transport_id);
      }
    } catch (error) {
      console.error("Error creating transport record", error);
    }
  };

  return (
    <FormContainer>
      <h1>Transport Record</h1>
      <form onSubmit={handleFormSubmit}>
        <FormLabel>Transport Volume:</FormLabel>
        <FormInput
          type="number"
          value={transportVolume}
          onChange={(e) => setTransportVolume(parseFloat(e.target.value))}
        />

        <FormLabel>Expected Route:</FormLabel>
        <FormInput
          type="text"
          value={expectedRoute}
          onChange={(e) => setExpectedRoute(e.target.value)}
        />

        <FormLabel>Completion Status:</FormLabel>
        <FormInput
          type="checkbox"
          checked={completionStatus}
          onChange={(e) => setCompletionStatus(e.target.checked)}
        />

        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default TransportPage;
