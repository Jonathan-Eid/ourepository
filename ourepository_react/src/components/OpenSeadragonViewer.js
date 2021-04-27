import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";

const {REACT_APP_PHP_DOMAIN, REACT_APP_PHP_PORT} = process.env;
const baseURL = `http://${REACT_APP_PHP_DOMAIN}:${REACT_APP_PHP_PORT}/`;

const OpenSeaDragonViewer = ({ image }) => {
  const [viewer, setViewer] = useState( null);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    setViewer(
      OpenSeaDragon({
        id: "openSeaDragon",
        prefixUrl: baseURL + "images/",
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2,
        showNavigator:  true,
        navigatorPosition:   "BOTTOM_LEFT",
        tileSources: {
          // type: 'image',
          // url: baseURL + "mosaics/1/england-london-bridge_files"
          // url: baseURL + "?request=TILE&file=mosaics/1/england-london-bridge_files"
          // url: baseURL + "mosaics/1/england-london-bridge.png"
          // buildPyramid: true,
          height: 1200,
          width:  1600,
          tileSize: 256,
          minLevel: 8,
          getTileUrl: function( level, x, y ){
            return baseURL + "mosaics/1/england-london-bridge_files/" +
              level + "/" + x + "_" + y + ".png";
          }
        },
      })
    );
  };

  useEffect(() => {
    if (image && viewer) {
      viewer.open(image.source);
      viewer.open(image.source);
    }
  }, [image]);

  useEffect(() => {
    InitOpenseadragon();
    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  return (
    <div
      id="openSeaDragon"
      style={{
        height: "800px",
        width: "1200px"
      }}
    >
    </div>
  );
};
export { OpenSeaDragonViewer };