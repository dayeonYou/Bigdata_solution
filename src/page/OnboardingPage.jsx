import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as OceanLogo } from "../assets/icon/Logo.svg"; // 새로운 로고를 추가하세요
import CustomButton from "../component/common/CustomButton";

const OnboardingPage = () => {
  const [fade, setFade] = useState("start");
  const [buttonFade, setButtonFade] = useState("");

  useEffect(() => {
    setFade("end"); // 이미지의 fade 상태를 "end"로 변경하여 transition 시작
    const timeout = setTimeout(() => {
      setButtonFade("fade-in"); // 이미지의 transition이 끝난 후 버튼의 클래스 변경하여 transition 시작
    }, 2500); // 이미지의 transition 시간과 동일한 시간으로 설정

    return () => clearTimeout(timeout); // timeout 클리어
  }, []);

  return (
    <div className="wrap">
      <OnboardingWrap>
        <OceanLogo className={fade} style={{ width: "60%", height: "auto" }} />

        <OnboardingMsg>바다환경지킴이</OnboardingMsg>
        <SolutionMsg>빅데이터 기반 해양쓰레기 수거 솔루션</SolutionMsg>
        <CustomButton className={buttonFade} to="/app/login">
          시작하기
        </CustomButton>
      </OnboardingWrap>
    </div>
  );
};

export default OnboardingPage;

const OnboardingWrap = styled.div`
  display: flex;
  background-color: #e0f7fa; /* 해양을 연상시키는 밝은 색상 */
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh; /* 화면 전체 높이를 차지하도록 설정 */
  border-radius: 20px; /* 경계선 둥글게 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 추가 */
  padding: 20px; /* 내부 여백 추가 */
`;

const OnboardingMsg = styled.div`
  font-family: "KotraHope", sans-serif; /* fallback font 추가 */
  color: #0aafde; /* 버튼과 동일한 색상 */
  font-size: 2rem; /* 폰트 크기 증가 */
  letter-spacing: 0.1em;
  margin: 20px 0; /* 여백 조정 */
  text-align: center; /* 중앙 정렬 */
`;

const SolutionMsg = styled.div`
  //font-family: "KotraHope", sans-serif; fallback font 추가
  color: #666; /* 다크한 색상으로 변경 */
  font-size: 1rem; /* 폰트 크기 증가 */
  letter-spacing: 0.05em;
  margin-bottom: 30px; /* 아래쪽 마진 조정 */
  text-align: center; /* 중앙 정렬 */
`;
