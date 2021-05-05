import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
} from '@material-ui/core';
import React from "react";
import {useParams} from "react-router-dom";
import projectApiService from "../services/projectApi";
import MosaicCard from "../components/mosaic/MosaicCard";
import MosaicListToolbar from "../components/mosaic/MosaicListToolbar";

const Project = () => {

  const {projectUuid} = useParams();

  const [project, setProject] = React.useState(null)
  const [mosaics, setMosaics] = React.useState([])

  React.useEffect(() => {
    projectApiService.getMosaics(projectUuid).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        setMosaics(data.message.mosaics);
      } else {
        alert(data.message);
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Project | OURepository</title>
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
