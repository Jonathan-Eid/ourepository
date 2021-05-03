import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
} from '@material-ui/core';
import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import mosaicApiService from "../services/mosaicApi";
import MosaicCard from "../components/mosaic/MosaicCard";
import MosaicListToolbar from "../components/mosaic/MosaicListToolbar";
import {OpenSeaDragonViewer} from "../components/OpenSeadragonViewer";

const Mosaic = () => {

  const {state} = useLocation();

  const [mosaic, setMosaic] = React.useState(null)

  // // get the mosaic from the previous page
  // React.useEffect(() => {
  //   if (state) {
  //     setMosaic({state});
  //   }
  // }, []);

  React.useEffect(() => {
    if (!state) {
      return;
    }

    mosaicApiService.getMosaic(state.mosaic.uuid).then((response) => {
      const data = response.data;
      if (data.code === "MOSAIC_RECEIVED") {
        setMosaic(data.message);
      } else if (data.code === "MOSAIC_RECEIVED_FAILED") {
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
      return <Navigate to="/app/mosaics" />;
    }
  }

  return (
    <>
      {determineRedirect()}
      <Helmet>
        <title>Mosaics | OURepostory</title>
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
            {mosaic && <OpenSeaDragonViewer tilingDir={mosaic.tilingDir}/>}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Mosaic;
