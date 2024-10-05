// wasteMock.js
const wasteMockData = {
  coastline_histogram: {
    title: "Coastline Waste Distribution",
    data: [
      { amount: 30, frequency: 100 },
      { amount: 40, frequency: 150 },
      { amount: 50, frequency: 200 },
      { amount: 60, frequency: 250 },
      { amount: 70, frequency: 300 },
      { amount: 80, frequency: 100 },
    ],
    image: "path/to/coastline_histogram.png", // 이미지 경로
  },
  prediction_histogram: {
    title: "Waste Prediction Distribution",
    data: [
      { amount: 50, frequency: 120 },
      { amount: 60, frequency: 180 },
      { amount: 70, frequency: 250 },
      { amount: 80, frequency: 280 },
      { amount: 90, frequency: 230 },
    ],
    image: "path/to/prediction_histogram.png", // 이미지 경로
  },
  waste_prediction_map: {
    title: "Waste Prediction Map",
    locations: [
      { latitude: 37.57, longitude: 126.98, description: "Predicted Waste A" },
      { latitude: 37.56, longitude: 126.99, description: "Predicted Waste B" },
      { latitude: 37.55, longitude: 126.97, description: "Predicted Waste C" },
    ],
    html: "path/to/waste_prediction_map.html", // HTML 파일 경로
  },
  waste_map: {
    title: "Waste Map",
    locations: [
      { latitude: 37.56, longitude: 126.97, description: "Waste Location A" },
      { latitude: 37.57, longitude: 126.99, description: "Waste Location B" },
      { latitude: 37.58, longitude: 126.98, description: "Waste Location C" },
    ],
    html: "path/to/waste_map.html", // HTML 파일 경로
  },
  waste_data: {
    title: "Waste Data Overview",
    date: "2024-10-05",
    total_waste: 500,
    categories: [
      { category: "Plastic", amount: 200 },
      { category: "Organic", amount: 150 },
      { category: "Metal", amount: 100 },
      { category: "Glass", amount: 50 },
      { category: "Others", amount: 0 },
    ],
    notes: "This data represents the waste distribution for the month.",
  },
};

export default wasteMockData;
