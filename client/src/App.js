import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";
import ProfilePage from "./scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { Loading } from "./components/FlexBetween";

function App() {
  // Get the current theme mode from the Redux store
  const mode = useSelector((state) => state.mode);

  // Create a theme based on the current mode (light or dark)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // Check if the user is authenticated based on the presence of a token in the Redux store
  const isAuth = Boolean(useSelector((state) => state.token));

  // Loading state to simulate fetching data or other loading states
  const isLoading = false; // Replace this with your actual loading state

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isLoading && <Loading />}
          <Routes>
            {/* Route for the login page */}
            <Route path="/" element={<LoginPage />} />

            {/* Route for the home page, only accessible if authenticated */}
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />

            {/* Route for the profile page, only accessible if authenticated */}
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
