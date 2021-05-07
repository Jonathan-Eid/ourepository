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

  const [mosaicMap, setMosaicMap] = React.useState(null);
  const [indicateRender, setIndicateRender] = React.useState(false);

  const indicateRenderProjectPage = () => {
    setIndicateRender(!indicateRender);
  }

  React.useEffect(() => {
    projectApiService.getMosaics(projectUuid).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        let mosaicMap = new Map();
        data.message.mosaics.forEach(mosaic => {
          mosaic["progress"] = 0.0;
          mosaicMap.set(mosaic["uuid"], mosaic);
        });
        setMosaicMap(mosaicMap);
      } else {
        alert(data.message);
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  }, [projectUuid, indicateRender]);

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
          <MosaicListToolbar indicateRenderProjectPage={indicateRenderProjectPage} />
          <Box sx={{ pt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              {mosaicMap && [...mosaicMap.values()].map((mosaic) => (
                <Grid
                  item
                  key={mosaic.uuid}
                  lg={2}
                  md={6}
                  xs={12}
                >
                  <MosaicCard mosaic={mosaic} mosaicName={mosaic.name} />
                </Grid>
              ))}
              {/*<button onClick={() => {*/}
              {/*  mosaicMap.get([...mosaicMap.keys()][0]).name = "hi";*/}
              {/*  setMosaicMap(mosaicMap);*/}
              {/*}}>hello</button>*/}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Project;
