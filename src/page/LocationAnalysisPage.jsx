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

const LocationAnalysisPage = () => {
  const [locationName, setLocationName] = useState("");
  const [totalWasteCollected, setTotalWasteCollected] = useState(0);
  const [plastic, setPlastic] = useState(0);
  const [metal, setMetal] = useState(0);
  const [organic, setOrganic] = useState(0);
  const [collectionPrediction, setCollectionPrediction] = useState(0);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/location/analysis", {
        location_name: locationName,
        total_waste_collected: totalWasteCollected,
        waste_distribution: {
          plastic,
          metal,
          organic,
        },
        collection_prediction: collectionPrediction,
      });

      if (response.data.status === "success") {
        console.log("Location analysis created", response.data.location_id);
      }
    } catch (error) {
      console.error("Error creating location analysis", error);
    }
  };

  return (
    <FormContainer>
      <h1>Location Analysis</h1>
      <form onSubmit={handleFormSubmit}>
        <FormLabel>Location Name:</FormLabel>
        <FormInput
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />

        <FormLabel>Total Waste Collected:</FormLabel>
        <FormInput
          type="number"
          value={totalWasteCollected}
          onChange={(e) => setTotalWasteCollected(parseFloat(e.target.value))}
        />

        <FormLabel>Plastic Waste:</FormLabel>
        <FormInput
          type="number"
          value={plastic}
          onChange={(e) => setPlastic(parseFloat(e.target.value))}
        />

        <FormLabel>Metal Waste:</FormLabel>
        <FormInput
          type="number"
          value={metal}
          onChange={(e) => setMetal(parseFloat(e.target.value))}
        />

        <FormLabel>Organic Waste:</FormLabel>
        <FormInput
          type="number"
          value={organic}
          onChange={(e) => setOrganic(parseFloat(e.target.value))}
        />

        <FormLabel>Collection Prediction:</FormLabel>
        <FormInput
          type="number"
          value={collectionPrediction}
          onChange={(e) => setCollectionPrediction(parseFloat(e.target.value))}
        />

        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default LocationAnalysisPage;
