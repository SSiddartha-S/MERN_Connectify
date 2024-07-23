import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

// FlexBetween component for layout purposes
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

// Loading component for showing a centered loading spinner
const LoadingWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Full viewport height
  position: "fixed", // Fixed position to stay in the center of the viewport
  top: 0,
  left: 0,
  width: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay background
  zIndex: 9999, // High z-index to appear on top of other content
});

export const Loading = () => (
  <LoadingWrapper>
    <CircularProgress />
  </LoadingWrapper>
);

export default FlexBetween;
