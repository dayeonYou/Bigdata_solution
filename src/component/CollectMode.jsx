// CollectMode.js
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { locations as mockLocations } from "../assets/mock"; // Mock 데이터
import { Modal, Button } from "react-bootstrap"; // react-bootstrap 모달과 버튼 임포트
import "bootstrap/dist/css/bootstrap.min.css"; // React-Bootstrap 스타일시트 적용

// 지도에서 특정 위치로 이동하는 함수
const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();
  map.flyTo([lat, lng], 14, { duration: 2 });
  return null;
};

const CollectMode = () => {
  const [locations, setLocations] = useState(mockLocations); // 이미지 위치 상태 관리
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 정보
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const [selectedLatLng, setSelectedLatLng] = useState(null); // 선택된 경로 위치

  // 이미지 클릭 시 모달을 열고 선택된 이미지 정보 저장
  const handleImageClick = (location) => {
    setSelectedImage(location);
    setShowModal(true);
  };

  // 수거 완료 버튼 클릭 시 해당 위치 삭제
  const handleComplete = () => {
    setLocations((prevLocations) =>
      prevLocations.filter((loc) => loc !== selectedImage)
    );
    setShowModal(false); // 모달 닫기
  };

  // 모달 닫기
  const handleClose = () => setShowModal(false);

  // 경로 버튼 클릭 시 팝업을 띄우고 지도 이동
  const handleRouteClick = (lat, lng) => {
    setSelectedLatLng({ lat, lng });
  };

  // locations 데이터에서 route 데이터 동적으로 생성
  const route = locations.map((location) => ({
    name: location.description || "Unknown", // location에 설명이 없을 경우 기본값
    lat: location.position.lat,
    lng: location.position.lng,
  }));

  return (
    <>
      <MapContainer
        center={[35.1796, 129.0756]} // 부산시 중심 좌표
        zoom={12} // 부산을 보기 적당한 줌 레벨
        style={{ height: "500px", width: "100%" }}
      >
        {/* 지도에 타일 레이어 추가 */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 위치 데이터를 순회하며 마커와 이미지를 지도에 표시 */}
        {locations.map((location, index) => {
          const imageIcon = new L.Icon({
            iconUrl: location.image, // 이미지 URL
            iconSize: [50, 50], // 아이콘 크기
            iconAnchor: [25, 25], // 아이콘 중심
          });

          return (
            <Marker
              key={index}
              position={[location.position.lat, location.position.lng]} // 마커 위치
              icon={imageIcon} // 이미지 아이콘 설정
            >
              <Popup>
                <strong>
                  {location.description || `Location ${index + 1}`}
                </strong>
                <br />
                <img
                  src={location.image}
                  alt={`Location ${index}`}
                  style={{ width: "100px", height: "100px", cursor: "pointer" }}
                  onClick={() => handleImageClick(location)} // 이미지 클릭 시 모달 열기
                />
              </Popup>
            </Marker>
          );
        })}

        {/* 선택된 경로로 지도 이동 */}
        {selectedLatLng && (
          <FlyToLocation lat={selectedLatLng.lat} lng={selectedLatLng.lng} />
        )}
      </MapContainer>

      {/* 경로 표시 (지하철 노선도 스타일) */}
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
      >
        {route.map((stop, index) => (
          <React.Fragment key={index}>
            <Button
              variant="outline-dark"
              style={{
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                margin: "0 10px",
                padding: "0",
                fontWeight: "bold",
                fontSize: "12px", // 글자 크기 조정
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center", // 글자가 동그라미 안에 정렬되도록 설정
                whiteSpace: "nowrap", // 텍스트가 줄 바꿈 없이 출력되도록 설정
              }}
              onClick={() => handleRouteClick(stop.lat, stop.lng)} // 경로 클릭 시 지도 이동
            >
              {stop.name} {/* 경로 이름 전체 표시 */}
            </Button>
            {index < route.length - 1 && (
              <div
                style={{
                  width: "60px",
                  height: "4px",
                  backgroundColor: "black",
                  margin: "auto 0",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 모달 컴포넌트 */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>수거 완료</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* 선택된 이미지가 있을 때만 표시 */}
          {selectedImage && (
            <>
              <img
                src={selectedImage.image}
                alt="Selected"
                style={{ width: "100%", marginBottom: "15px" }}
              />
              <p>
                {selectedImage.description || "선택된 이미지 설명이 없습니다."}
              </p>
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
