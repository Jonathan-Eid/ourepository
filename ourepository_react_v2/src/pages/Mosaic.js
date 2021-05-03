import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
} from '@material-ui/core';
import React from "react";
import {useParams} from "react-router-dom";
import mosaicApiService from "../services/mosaicApi";
import MosaicListToolbar from "../components/mosaic/MosaicListToolbar";
import {OpenSeaDragonViewer} from "../components/OpenSeadragonViewer";

const Mosaic = () => {

  const {mosaicUuid} = useParams();

  const [mosaic, setMosaic] = React.useState(null)

  React.useEffect(() => {
    mosaicApiService.getMosaic(mosaicUuid).then((response) => {
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

  return (
    <>
      <Helmet>
        <title>Mosaic | OURepository</title>
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
