import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false); // State to toggle image upload
  const [isClip, setIsClip] = useState(false); // State to toggle video clip upload
  const [isAttachment, setIsAttachment] = useState(false); // State to toggle file attachment upload
  const [isAudio, setIsAudio] = useState(false); // State to toggle audio upload
  const [image, setImage] = useState(null); // State for the selected image
  const [clip, setClip] = useState(null); // State for the selected video clip
  const [attachment, setAttachment] = useState(null); // State for the selected file attachment
  const [audio, setAudio] = useState(null); // State for the selected audio file
  const [post, setPost] = useState(""); // State for the post text
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user); // Get user ID from Redux state
  const token = useSelector((state) => state.token); // Get auth token from Redux state
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); // Check if screen size is non-mobile
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  // Function to handle creating a post
  const handlePost = async () => {
    if (!post && !image && !clip && !attachment && !audio) {
      return; // Ensure post content or file is provided
    }

    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);

      // Append file data to formData if present
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }
      if (clip) {
        formData.append("clip", clip);
        formData.append("clipPath", clip.name);
      }
      if (attachment) {
        formData.append("attachment", attachment);
        formData.append("attachmentPath", attachment.name);
      }
      if (audio) {
        formData.append("audio", audio);
        formData.append("audioPath", audio.name);
      }

      const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const posts = await response.json();
      dispatch(setPosts({ posts })); // Update Redux state with new posts
      // Clear all states after posting
      setImage(null);
      setClip(null);
      setAttachment(null);
      setAudio(null);
      setPost("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} /> {/* Display user's profile image */}
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      
      {/* Conditional rendering for image upload */}
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {/* Conditional rendering for video clip upload */}
      {isClip && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".mp4,.mov"
            multiple={false}
            onDrop={(acceptedFiles) => setClip(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!clip ? (
                    <p>Add Clip Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{clip.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {clip && (
                  <IconButton
                    onClick={() => setClip(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {/* Conditional rendering for file attachment upload */}
      {isAttachment && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".pdf,.doc,.docx,.ppt,.pptx"
            multiple={false}
            onDrop={(acceptedFiles) => setAttachment(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!attachment ? (
                    <p>Add Attachment Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{attachment.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {attachment && (
                  <IconButton
                    onClick={() => setAttachment(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {/* Conditional rendering for audio upload */}
      {isAudio && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".mp3"
            multiple={false}
            onDrop={(acceptedFiles) => setAudio(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!audio ? (
                    <p>Add Audio Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{audio.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {audio && (
                  <IconButton
                    onClick={() => setAudio(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

            {/* Buttons to toggle file upload sections */}
            <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsClip(!isClip)}>
          <GifBoxOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Clip
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsAttachment(!isAttachment)}>
          <AttachFileOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Attachment
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsAudio(!isAudio)}>
          <MicOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Audio
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        ) : null}

        <Button
          disabled={!post && !image && !clip && !attachment && !audio} // Disable button if no content or file is selected
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
