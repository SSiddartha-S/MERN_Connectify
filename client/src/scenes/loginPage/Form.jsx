import { useState } from "react"; // Import useState hook from React
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"; // Import MUI components and hooks
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // Import MUI icon
import { Formik } from "formik"; // Import Formik for form handling
import * as yup from "yup"; // Import Yup for form validation
import { useNavigate } from "react-router-dom"; // Import hook for navigation
import { useDispatch } from "react-redux"; // Import hook for dispatching actions
import { setLogin } from "../../state"; // Import action from Redux state
import Dropzone from "react-dropzone"; // Import Dropzone for file uploads
import FlexBetween from "../../components/FlexBetween"; // Import custom component

// Validation schema for registration form using Yup
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.mixed().required("required"),
});

// Validation schema for login form using Yup
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

// Initial values for registration form
const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: null,
};

// Initial values for login form
const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login"); // State to toggle between login and register
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error messages
  const { palette } = useTheme(); // Access theme colors
  const dispatch = useDispatch(); // Dispatch action to Redux store
  const navigate = useNavigate(); // Navigation hook for routing
  const isNonMobile = useMediaQuery("(min-width:600px)"); // Media query to check if screen width is >= 600px
  const isLogin = pageType === "login"; // Check if current page type is login
  const isRegister = pageType === "register"; // Check if current page type is register

  // Handle user registration
  const register = async (values, onSubmitProps) => {
    try {
      const formData = new FormData(); // Create a FormData object to handle file upload
      for (let value in values) {
        formData.append(value, values[value]); // Append form values to formData
      }
      formData.append("picturePath", values.picture.name); // Append picture name

      const savedUserResponse = await fetch(
        "http://localhost:3001/auth/register",
        {
          method: "POST",
          body: formData, // Send formData as request body
        }
      );

      const savedUser = await savedUserResponse.json(); // Parse JSON response
      if (savedUser.error) {
        setErrorMessage(savedUser.error); // Set error message if there's an error
      } else {
        onSubmitProps.resetForm(); // Reset form after successful registration
        setPageType("login"); // Switch to login page
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Server error during registration. Please try again later."); // Set error message for server error
    }
  };

  // Handle user login
  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values), // Send form values as JSON
      });

      const loggedIn = await loggedInResponse.json(); // Parse JSON response
      if (loggedIn.msg || loggedIn.error) {
        setErrorMessage(loggedIn.msg || loggedIn.error); // Set error message if there's an error
      } else {
        onSubmitProps.resetForm(); // Reset form after successful login
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        ); // Dispatch login action to Redux store
        navigate("/home"); // Navigate to home page
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Server error during login. Please try again later."); // Set error message for server error
    }
  };

  // Handle form submission based on page type
  const handleFormSubmit = async (values, onSubmitProps) => {
    setErrorMessage(""); // Clear previous error messages
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit} // Handle form submission
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister} // Set initial values based on page type
      validationSchema={isLogin ? loginSchema : registerSchema} // Set validation schema based on page type
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {/* Registration fields */}
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName || ""}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName || ""}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location || ""}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation || ""}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png" // Restrict accepted file types
                    multiple={false} // Allow only one file
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p> // Placeholder text when no picture is selected
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography> {/* Display picture name */}
                            <EditOutlinedIcon /> {/* Edit icon */}
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            {/* Common fields for both login and registration */}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email || ""}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password || ""}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* Display error message */}
          {errorMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"} {/* Button text based on page type */}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login"); // Toggle page type
                resetForm(); // Reset form fields
                setErrorMessage(""); // Clear error message when switching forms
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here." // Text to switch to registration
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;

