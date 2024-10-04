import { styled } from "@stitches/react";
import { Link } from "react-router-dom";

// Define the styled Button component
const StyledButton = styled(Link, {
  width: "250px", // Default width
  height: "40px", // Default height
  marginBottom: "0px", // Default margin bottom
  marginTop: "0px", // Default margin top
  backgroundColor: "#0AAFDE", // Default background color
  color: "white", // Default text color
  padding: "0px", // Default padding
  fontSize: "15px",
  fontWeight: "500",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  cursor: "pointer",
  textDecoration: "none",
  position: "relative",

  // Add responsive styling or props-driven styling using variants
  variants: {
    width: { custom: (val) => ({ width: val }) },
    height: { custom: (val) => ({ height: val }) },
    marginBottom: { custom: (val) => ({ marginBottom: val }) },
    marginTop: { custom: (val) => ({ marginTop: val }) },
    backgroundColor: { custom: (val) => ({ backgroundColor: val }) },
    textColor: { custom: (val) => ({ color: val }) },
    padding: { custom: (val) => ({ padding: val }) },
  },
});

// Export the Button component
export default function CustomButton(props) {
  return <StyledButton {...props}>{props.children}</StyledButton>;
}
