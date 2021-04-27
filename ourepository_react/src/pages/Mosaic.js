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

const MosaicPage = (props) => {
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
    sidebarService.setHeader()
  }, [])


  sidebarService.setHeader()

  return (

    <div class="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
      <div>
        {/*<img src={"http://localhost:5000/mosaics/1/england-london-bridge_preview.png"} alt="preview" height="75%" width="75%"/>*/}

        <OpenSeaDragonViewer image="mosaics/1/england-london-bridge_files" />
      </div>
    </div>
  );

}

export default MosaicPage;