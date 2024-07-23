import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  // Fetch friends from the API
  const getFriends = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Check for successful response
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }

      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      setError(error.message);
      console.error("Error fetching friends:", error.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, token, userId]);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            ))
          ) : (
            <Typography>No friends found</Typography>
          )}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default FriendListWidget;
