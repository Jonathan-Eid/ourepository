import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';
import {useNavigate} from "react-router-dom";

const ProjectCard = ({ project, ...rest }) => {

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/app/project', { state: {project} });
  }

  return (
    <Card onClick={handleCardClick}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
          {...rest}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
          <Avatar
            alt="Product"
            src={"/favicon.ico"}
            variant="square"
          />
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {project.name}
        </Typography>
      </CardContent>
    </Card>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired
};

export default ProjectCard;
