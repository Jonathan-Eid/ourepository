import React from 'react';
import {Link, useRouteMatch, Switch, Route, useParams} from "react-router-dom"
import button from '../logo.svg';
import Popup from 'reactjs-popup';


const Project = (props) => {
  const [organization, setOrganization] = React.useState(null);
  const [edit_enabled, enableEdit] = React.useState(null);
  let {id} = useParams();
  let name = "Wind Turbines"
  let mosaics = [
    {name: "Turbine", size: "482mb", res: "17000 x 38000", channels: 4,}
  ]


  // Move to "ProjectService"
  function checkAndApplyPriviledges() {

  }

  React.useEffect(() => {
    checkAndApplyPriviledges()

  }, [])
  /*apiService.getOrgs().then((data) => {
    console.log("ORG DATA: "+JSON.stringify(data.data))
    const resp = data.data
    if (resp.code == "ORGS_RECEIVED_FAILED"){
      return;
    }
    else if (data.data) {
      setOrganizations(resp.message)
    }
    console.log(data.data[0]);
  }).catch((err) => {
    console.log(err);
  })*/

  return (
    <div class="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex ">

      <div class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8"> Project's Mosaics
        <div class=" p-1"></div>

        <div class="width:100%; height: 200px; background-color: grey;">
          {mosaics && mosaics.map((org) => (
            <div class="bg-gray-800 shadow-md rounded px-4 pt-3 pb-4">

              <img src={button} alt="Thumbnail Image" width="175" height="175"></img>
              <Link to={`/organization/${org.name}`}>{org.name} </Link>
              <Popup arrow={true} contentStyle={{padding: '0px', border: 'none'}}
                     trigger={<button class="w-6 bg-blue-300 rounded-full shadow-outline"><img
                       src="/images/arrow-button-circle-down-1.png"/></button>}>
                <ul>
                  <li>
                    <div>view Mosaic</div>
                  </li>
                  <li>
                    <div>delete Mosaic</div>
                  </li>
                </ul>
              </Popup></div>

          ))}
        </div>

      </div>


    </div>
  );
};

export default Project;