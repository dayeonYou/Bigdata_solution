import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import domtoimage from "dom-to-image";
import { Button } from "react-bootstrap";
import L from "leaflet";

// 마커 범위에 맞게 지도를 조정하는 컴포넌트
const FitBounds = ({ mapData }) => {
  const map = useMap();

  useEffect(() => {
    if (mapData.length > 0) {
      const bounds = new L.LatLngBounds(
        mapData.map((point) => [point.lat, point.lon])
      );
      map.fitBounds(bounds); // 마커 범위에 맞게 지도 줌인
    }
  }, [mapData, map]);

  return null;
};

const WasteMap = ({ data }) => {
  const [mapData, setMapData] = useState([]);
  const mapRef = useRef(null); // 지도를 캡처하기 위한 ref

  // 데이터 파싱
  useEffect(() => {
    if (data && data.length > 0) {
      const parsedData = data.map((item) => ({
        lat: item.latitude,
        lon: item.longitude,
        size:
          item.prediction > 400 ? item.prediction / 200 : item.prediction / 60, // 마커 크기를 더욱 줄이기 위해 나누기
        color: item.prediction > 400 ? "red" : "blue", // 예측값에 따라 색상 설정
        hovertext: item.username, // 사용자 이름을 팝업에 표시
        customdata: item.prediction, // 수거 예상량
      }));
      setMapData(parsedData);
    }
  }, [data]);

  // 지도 전체 범위를 캡처하는 함수
  const handleDownloadImage = () => {
    if (mapRef.current) {
      domtoimage.toBlob(mapRef.current).then(function (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "waste_map.png";
        link.click();
      });
    }
  };

  return (
    <>
      <div
        ref={mapRef}
        style={{ position: "relative", width: "90vw", height: "75vh" }} // 지도의 가로 크기를 더 크게 설정
      >
        <MapContainer
          center={[35.1796, 129.0756]} // 임시 중심 좌표 (fitBounds로 조정될 예정)
          zoom={10} // 초기 줌 레벨을 낮춰서 더 넓게 보이게 설정
          style={{ height: "100%", width: "100%" }} // 비율을 유지하기 위해 전체 사용
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {mapData.map((point, index) => (
            <CircleMarker
              key={index}
              center={[point.lat, point.lon]}
              radius={point.size} // 조정된 마커 크기
              fillColor={point.color} // 색상 설정
              color={point.color} // 외곽선 색상 설정
              fillOpacity={0.5}
              stroke={false}
            >
              <Popup>
                <strong>{point.hovertext}</strong>
                <br />
                수거 예상량: {point.customdata} L
              </Popup>
            </CircleMarker>
          ))}
          <FitBounds mapData={mapData} />
        </MapContainer>
      </div>
      <Button onClick={handleDownloadImage} style={{ margin: "10px 0" }}>
        현재 지도 저장
      </Button>
    </>
  );
};

export default WasteMap;
