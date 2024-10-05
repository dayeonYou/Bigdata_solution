import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 20, { duration: 2 });
  }, [lat, lng, map]);
  return null;
};

const CollectMode = () => {
  const [locations, setLocations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // API에서 청소 데이터를 가져오는 함수
  const fetchCleaningInfo = async () => {
    try {
      const response = await axios.get(
        "http://10.30.0.179:8080/api/cleaning-info",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLocations(response.data);
      console.log("response.data", response.data); // 데이터 확인을 위한 콘솔 로그
    } catch (error) {
      console.error("Error fetching cleaning info:", error);
    }
  };

  useEffect(() => {
    fetchCleaningInfo();
  }, []);

  const handleImageClick = (location) => {
    setSelectedImage(location);
    setShowModal(true);
  };

  // DELETE 요청을 통해 데이터를 삭제하는 함수
  const handleComplete = async () => {
    if (selectedImage) {
      try {
        // cleaning_id를 경로에 포함하여 DELETE 요청 전송
        await axios.delete(
          `http://10.30.0.179:8080/api/cleaning/${selectedImage.cleaning_id}`
        );

        // 상태에서 해당 항목 제거하여 UI 업데이트
        setLocations((prevLocations) =>
          prevLocations.filter(
            (loc) => loc.cleaning_id !== selectedImage.cleaning_id
          )
        );
        setShowModal(false); // 모달 닫기
      } catch (error) {
        setErrorMessage("Error deleting cleaning data.");
        console.error("Error deleting cleaning data:", error);
      }
    }
  };

  const handleClose = () => setShowModal(false);

  const handleRouteClick = (lat, lng) => {
    setSelectedLatLng({ lat, lng });
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <>
      <MapContainer
        center={[35.1796, 129.0756]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {locations.map((location, index) => {
          const defaultIconUrl = "path/to/default/icon.png";
          const imageIcon = new L.Icon({
            iconUrl: location.image || defaultIconUrl,
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          });

          return (
            <Marker
              key={index}
              position={[location.position.lat, location.position.lng]}
              icon={imageIcon}
            >
              <Popup>
                <strong>
                  {location.coast_name || `Location ${index + 1}`}
                </strong>
                <br />
                <img
                  src={location.image}
                  alt={`Location ${index}`}
                  style={{ width: "100px", height: "100px", cursor: "pointer" }}
                  onClick={() => handleImageClick(location)}
                />
              </Popup>
            </Marker>
          );
        })}

        {selectedLatLng && (
          <FlyToLocation lat={selectedLatLng.lat} lng={selectedLatLng.lng} />
        )}
      </MapContainer>

      <div style={{ margin: "20px 0" }}>
        <Row xs={1} md={3} className="g-4">
          {locations
            .slice(0, showMore ? locations.length : 6)
            .map((location, index) => (
              <Col key={index}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={location.image || "path/to/default/image.png"}
                    onClick={() => handleImageClick(location)}
                    style={{
                      cursor: "pointer",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>
                      {location.coast_name || `Location ${index + 1}`}
                    </Card.Title>
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleRouteClick(
                          location.position.lat,
                          location.position.lng
                        )
                      }
                    >
                      지도 보기
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>

        {locations.length > 6 && (
          <Button
            variant="link"
            onClick={toggleShowMore}
            style={{ marginTop: "15px" }}
          >
            {showMore ? "접기" : "더 보기"}
          </Button>
        )}
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>수거 완료</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <>
              <img
                src={selectedImage.image || "path/to/default/image.png"}
                alt="Selected"
                style={{ width: "100%", marginBottom: "15px" }}
              />
              <p>위치명: {selectedImage.coast_name || "위치명이 없습니다."}</p>
              <p>수거된 양: {selectedImage.collected_amount || 0}개</p>
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleComplete}>
            수거 완료
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CollectMode;
