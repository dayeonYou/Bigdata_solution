import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // react-router-dom 사용
import styled from "styled-components";

// 스타일 컴포넌트
const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  //box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #0aafde;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0aafde;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://10.30.0.179:8080/api/login", {
        username,
        password,
      });

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token); // 토큰 저장
        localStorage.setItem("username", username); // 사용자가 입력한 이름 저장
        navigate("/app/main"); // 로그인 성공 시 페이지 이동
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <LoginWrapper>
      <LoginContainer>
        <form onSubmit={handleLogin}>
          <h2>로그인</h2>
          <InputField
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitButton type="submit">Login</SubmitButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </LoginContainer>
    </LoginWrapper>
  );
};

export default LoginForm;
