import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../component/layout/main-layout";
import InvestigationInput from "../page/InvestigationInput";
import InvestigationInfoPage from "../page/ModeInfo/InvestigationInfoPage";
import MainPage from "../page/MainPage";
import CleanerInput from "../page/CleanerInput";
import ManagerMode from "../page/ManagerMode";
import ManagerInfoPage from "../page/ModeInfo/ManagerInfoPage";
import CleanerInfoPage from "../page/ModeInfo/CleanerInfoPage copy";
import DriverModePage from "../page/DriverModePage";
import DriverInfoPage from "../page/ModeInfo/DriverInfoPage";
import TransportPage from "../page/TransportPage";
import LocationAnalysisPage from "../page/LocationAnalysisPage";
import DriverInputPage from "../page/DriverInputPage";
import LoginForm from "../page/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // MainLayout을 부모로 설정
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/check",
        element: <InvestigationInfoPage />,
      },
      {
        path: "/check/form",
        element: <InvestigationInput />,
      },
      {
        path: "/cleaner",
        element: <CleanerInfoPage />,
      },
      {
        path: "/cleaner/form",
        element: <CleanerInput />,
      },
      {
        path: "/manager",
        element: <ManagerInfoPage />,
      },
      {
        path: "/manager/form",
        element: <ManagerMode />,
      },
      {
        path: "/driver",
        element: <DriverInfoPage />,
      },
      {
        path: "/driver/form",
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
