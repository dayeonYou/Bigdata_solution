import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../component/layout/main-layout";
import InvestigationInput from "../page/InvestigationInput";
import InvestigationInfoPage from "../page/ModeInfo/InvestigationInfoPage";
import MainPage from "../page/MainPage";
import CleanerInput from "../page/CleanerInput";
import ManagerMode from "../component/BasicStatistics";
import ManagerInfoPage from "../page/ModeInfo/ManagerInfoPage";
import CleanerInfoPage from "../page/ModeInfo/CleanerInfoPage copy";
import DriverModePage from "../page/DriverModePage";
import DriverInfoPage from "../page/ModeInfo/DriverInfoPage";
import TransportPage from "../page/TransportPage";
import LocationAnalysisPage from "../page/LocationAnalysisPage";
import DriverInputPage from "../page/DriverInputPage";
import LoginForm from "../page/LoginPage";
import OnboardingPage from "../page/OnboardingPage";
import MapPage from "../page/MapPage";
const router = createBrowserRouter([
  {
    path: "/", // OnboardingPage를 루트 경로에 설정
    element: <OnboardingPage />,
  },
  {
    path: "/app", // MainLayout이 필요한 나머지 페이지는 별도의 경로로 설정
    element: <MainLayout />,
    children: [
      {
        path: "main", // 상대 경로로 수정
        element: <MainPage />,
      },
      {
        path: "login", // 상대 경로로 수정
        element: <LoginForm />,
      },
      {
        path: "check",
        element: <InvestigationInfoPage />,
      },
      {
        path: "check/form",
        element: <InvestigationInput />,
      },
      {
        path: "cleaner",
        element: <CleanerInfoPage />,
      },
      {
        path: "cleaner/form",
        element: <CleanerInput />,
      },
      {
        path: "manager",
        element: <ManagerInfoPage />,
      },
      {
        path: "manager/form",
        element: <MapPage />,
      },
      {
        path: "driver",
        element: <DriverInfoPage />,
      },
      {
        path: "driver/form",
        element: <DriverModePage />, // 운전자 모드 페이지 추가
        children: [
          {
            path: "transport",
            element: <TransportPage />, // 운송량 기록 페이지 추가
          },
          {
            path: "input",
            element: <DriverInputPage />, // 운전 정보 입력 페이지 추가
          },
          {
            path: "location-analysis",
            element: <LocationAnalysisPage />, // 위치 분석 페이지 추가
          },
        ],
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
