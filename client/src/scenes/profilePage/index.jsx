// Import necessary components and hooks from MUI, React, and Redux
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";

// Define the ProfilePage component
const ProfilePage = () => {
  const [user, setUser] = useState(null); // State to store user data
  const { userId } = useParams(); // Get the userId from URL parameters
  const token = useSelector((state) => state.token); // Get the token from Redux state
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)"); // Check if screen width is at least 1000px

  // Function to fetch user data from the server
  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers for authentication
    });
    const data = await response.json(); // Parse the JSON response
    setUser(data); // Set the user data in state
  };

  // useEffect to fetch user data when the component mounts
  useEffect(() => {
    getUser();
  }); 

  if (!user) return null; // Return null if user data is not yet loaded

  return (
    <Box>
      <Navbar /> {/* Render the Navbar component */}
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"} // Use flex layout on non-mobile screens, block layout on mobile screens
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} /> {/* Render the UserWidget component */}
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} /> {/* Render the FriendListWidget component */}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"} // Add top margin on mobile screens
        >
          <MyPostWidget picturePath={user.picturePath} /> {/* Render the MyPostWidget component */}
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile /> {/* Render the PostsWidget component */}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage; // Export the ProfilePage component
