import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
} from '@material-ui/core';
import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import projectApiService from "../services/projectApi";
import MosaicCard from "../components/mosaic/MosaicCard";
import MosaicListToolbar from "../components/mosaic/MosaicListToolbar";

const Project = () => {

  const {state} = useLocation();

  const [project, setProject] = React.useState(null)
  const [mosaics, setMosaics] = React.useState([])

  // get the project from the previous page
  React.useEffect(() => {
    if (state) {
      setProject({state});
    }
  }, []);

  React.useEffect(() => {
    if (!state) {
      return;
    }

    projectApiService.getMosaics(state.project.uuid).then((response) => {
      const data = response.data;
      if (data.code === "MOSAICS_RECEIVED") {
        setMosaics(data.message.mosaics);
      } else {
        alert("Something went wrong");
      }
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const determineRedirect = () => {
    if (state) {
      return <></>;
    } else {
      return <Navigate to="/app/projects" />;
    }
  }

  return (
    <>
      {determineRedirect()}
      <Helmet>
        <title>Projects | OURepostory</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <MosaicListToolbar />
          <Box sx={{ pt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              {mosaics && mosaics.map((mosaic) => (
                <Grid
                  item
                  key={mosaic.uuid}
                  lg={2}
                  md={6}
                  xs={12}
                >
                  <MosaicCard mosaic={mosaic} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Project;
