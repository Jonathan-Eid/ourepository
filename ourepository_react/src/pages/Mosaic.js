import React from 'react';
import navbarService from "../services/navbar"
import sidebarService from "../services/sidebar"
import {Link, useRouteMatch, Switch, Route, useParams} from "react-router-dom"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import apiService from "../services/api"
import {Redirect} from "react-router-dom";
import AddUserPage from './AddUserToOrg';
import {OpenSeaDragonViewer} from "../components/OpenSeadragonViewer";
import {CardBody} from "reactstrap";

import {useState} from "react";



const MosaicPage = (props) => {

  let {mosaicUuid} = useParams();

  const [mosaicData, setMosaicData] = React.useState(null)
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  let choices = [
    {text: 'Yes', value: true},
    {text: 'No', value: false}
  ]

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };
  let radioChange = (event) => {
    
  }

  // get the mosaic data
  React.useEffect(() => {
    apiService.getMosaicData(mosaicUuid).then((data) => {
      const resp = data.data
      if (resp.code === "MOSAIC_DATA_RECEIVED") {
        setMosaicData(resp.message);
      } else {
        console.log(resp.message)
      }
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  React.useEffect(() => {
    navbarService.setHeading(<>
        <form class="form-inline">


          <Popup arrow={true} contentStyle={{padding: '0px', border: 'none'}}
                 trigger={<button class="w-6 bg-blue-300 rounded-full shadow-outline"><img
                   src="/images/arrow-button-circle-down-1.png"/></button>}>
            <div>Popup content here !!</div>
          </Popup>
          <h2 class="text-2xl underline"> Mosaic_Name.extension</h2>
        </form>


      </>
    )
    navbarService.setToolbar([])
    sidebarService.setHeader(
      <div class="mb-6 items-right text-right">
        <div class="pb-4"></div>
        <div class="p-1 rounded-md bg-gradient-to-bl bg-blue-900"> upload annotations</div>
        <input type="file" name="file" onChange={changeHandler}/>
      </div>
    )
  }, [])


  sidebarService.setHeader();

  return (

    <div class="bg-gray-850 rounded px-8 pt-6 pb-8 mb-400 flex flex-col w-3/5"
    style={
      {marginTop: "130px"}}>
      <div>
        {/* load the OpenSeaDragonViewer once the mosaicData is loaded */}
        {mosaicData && <OpenSeaDragonViewer tilingDir={mosaicData.tiling_dir}/>}
      </div>
    </div>
  );

};

export default MosaicPage;