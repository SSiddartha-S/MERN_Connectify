
import { Typography, useTheme, Box } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const AdvertWidget = ({
  imageSrc = "http://localhost:3001/assets/info4.jpeg", // Default image URL
  title = "Sponsored",
  subtitle = "Create Ad",
  companyName = "Your Company",
  companyUrl = "yourcompany.com",
  description = "Your pathway to stunning and immaculate beauty."
}) => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          {title}
        </Typography>
        <Typography color={medium}>{subtitle}</Typography>
      </FlexBetween>

      <Box
        width="100%"
        height="200px" // Set a fixed height for the image container
        borderRadius="0.75rem"
        mt="0.75rem"
        overflow="hidden"
        position="relative" // Enable positioning for the image
      >
        <img
          src={imageSrc}
          alt="advert"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Cover the container without distortion
            borderRadius: '0.75rem',
            position: 'absolute', // Positioning to fit the container
            top: 0,
            left: 0,
          }}
          onError={(e) => {
            e.target.src = "http://localhost:3001/assets/default-ad.jpeg"; // Fallback image on error
          }}
        />
      </Box>

      <FlexBetween mt="1rem">
        <Typography color={main} variant="h6">
          {companyName}
        </Typography>
        <Typography color={medium}>{companyUrl}</Typography>
      </FlexBetween>

      <Typography color={medium} mt="0.5rem">
        {description}
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
