import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const token = useSelector((state) => state.token);
  const [posts, setPostsState] = useState([]);

  const getPostsCallback = useCallback(async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setPostsState(data);
  }, [token]);

  const getUserPostsCallback = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setPostsState(data);
  }, [token, userId]);

  useEffect(() => {
    if (isProfile) {
      getUserPostsCallback();
    } else {
      getPostsCallback();
    }
  }, [isProfile, getUserPostsCallback, getPostsCallback]);

  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
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
              picturePath={picturePath}
              userPicturePath={userPicturePath}
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