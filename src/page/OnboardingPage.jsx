import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as OceanLogo } from "../assets/icon/CleanerIcon.svg"; // 새로운 로고를 추가하세요
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
        <OceanLogo className={fade} />

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
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  width: 100%; /* 폭을 조금 더 늘렸습니다 */
  height: 100%;
  border-radius: 20px; /* 경계선 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 추가 */
`;

const OnboardingMsg = styled.div`
  font-family: "KotraHope";
  color: #0aafde; /* 바다 색상 */
  font-size: 1.5rem; /* 폰트 크기 증가 */
  letter-spacing: 0.1em;
  margin-bottom: 10vh; /* 아래쪽 마진을 줄였습니다 */
`;

const SolutionMsg = styled.div`
  font-family: "KotraHope";
  color: #0aafde; /* 바다 색상 */
  font-size: 1rem;
  letter-spacing: 0.1em;
  margin-bottom: 20vh; /* 아래쪽 마진 조정 */
`;

const StartButton = styled(Link)`
  font-size: 16px; /* 폰트 크기 증가 */
  background-color: #00796b; /* 버튼 색상 */
  color: white;
  text-decoration: none;
  border-radius: 20px;
  padding: 12px 80px;
  text-align: center;
  width: 40%; /* 버튼 폭 증가 */

  cursor: pointer;
  font-family: Pretendard;
  opacity: 0; /* 초기에는 투명하게 설정 */
  transition: opacity 2s; /* transition 효과 설정 */

  &.fade-in {
    opacity: 1; /* transition으로 인해 서서히 나타나도록 설정 */
  }
`;

const StyledImg = styled.img`
  width: 70%;
  height: 25%;
  opacity: 0; /* 초기에는 투명하게 설정 */
  transition: opacity 2s; /* transition 효과 설정 */

  &.end {
    opacity: 1; /* transition으로 인해 서서히 나타나도록 설정 */
  }
`;
