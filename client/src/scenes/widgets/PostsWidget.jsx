import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const token = useSelector((state) => state.token);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null); // State to handle errors

  // Fetch all posts
  const getPosts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message); // Set error message
    }
  }, [token]);

  // Fetch posts for a specific user
  const getUserPosts = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user posts: ${response.statusText}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message); // Set error message
    }
  }, [token, userId]);

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [isProfile, getUserPosts, getPosts]);

  return (
    <>
      {error ? (
        <p>Error: {error}</p> // Display error if there is one
      ) : posts.length > 0 ? (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath, // Path to post image
            userPicturePath, // Path to user image
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath ? `http://localhost:6001/assets/${picturePath}` : null} // Adjust image URL
              userPicturePath={userPicturePath ? `http://localhost:6001/assets/${userPicturePath}` : null} // Adjust image URL
              likes={likes}
              comments={comments}
            />
          )
        )
      ) : (
        <p>No posts found</p>
      )}
    </>
  );
};

export default PostsWidget;
