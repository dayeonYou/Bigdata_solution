import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Alert } from "react-bootstrap";
import { Flex } from "../style/Flex";
import axios from "axios";

const BasicStatistics = ({ startDate, endDate }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [htmlFiles, setHtmlFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("images");

  // Fetch data when startDate or endDate changes
  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      if (startDate > endDate) {
        setErrorMessage("Start date must be before end date.");
        return;
      }

      setErrorMessage(null);

      try {
        const response = await axios.get(
          "http://10.30.0.179:8080/api/management/export-investigation",
          {
            params: {
              start_date: startDate,
              end_date: endDate,
            },
            responseType: "json",
          }
        );

        const { coastline_histogram, prediction_histogram } = response.data;

        if (!coastline_histogram || !prediction_histogram) {
          setErrorMessage("Missing data in response.");
          return;
        }

        // Set image URLs and HTML files
        setImageUrls([coastline_histogram, prediction_histogram]);

        // Automatically activate the images tab when data is fetched
        setActiveTab("images");
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const handleError = (error) => {
    console.error("Error querying management data:", error);
    if (error.response) {
      setErrorMessage(
        `Error: ${error.response.status} - ${
          error.response.data.message || "Unknown error"
        }`
      );
    } else if (error.request) {
      setErrorMessage("No response received from the server.");
    } else {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const downloadImage = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "image.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Flex>
      <Container>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {activeTab === "images" && (
          <ImageContainer>
            {imageUrls.length > 0 ? (
              imageUrls.map((url, index) => (
                <ImageWrapper key={index}>
                  <StyledImage src={url} alt={`result-${index}`} />
                </ImageWrapper>
              ))
            ) : (
              <p>No images available.</p>
            )}
          </ImageContainer>
        )}
      </Container>
    </Flex>
  );
};

export default BasicStatistics;

// Styled Components remain unchanged
const Container = styled.div`
  margin: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center align images and buttons */
`;

const DownloadButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

// Add styles for images
const StyledImage = styled.img`
  max-width: 100%; /* Prevent images from overflowing */
  height: auto; /* Maintain aspect ratio */
`;
