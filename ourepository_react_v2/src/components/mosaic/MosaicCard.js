import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent, CardMedia,
  Divider,
  Grid,
  Typography
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';
import {useNavigate} from "react-router-dom";
import React from "react";

const {REACT_APP_PHP_DOMAIN, REACT_APP_PHP_PORT} = process.env;
const baseURL = `http://${REACT_APP_PHP_DOMAIN}:${REACT_APP_PHP_PORT}/`;

const MosaicCard = ({ mosaic, ...rest }) => {

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/app/mosaic/${mosaic.uuid}`);
  }

  React.useEffect(() => {
    let x = 1;
  }, [mosaic.name]);

  return (
    <Card onClick={handleCardClick}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
          {...rest}
    >
      <CardMedia
        component="img"
        image={baseURL + mosaic.thumbnail}
        title={mosaic.name}
      />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {mosaic.name}
          {/*{mosaic.progress}*/}
        </Typography>
      </CardContent>
    </Card>
  );
}

MosaicCard.propTypes = {
  mosaic: PropTypes.object.isRequired
};

export default MosaicCard;
