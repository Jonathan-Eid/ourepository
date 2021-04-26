import React from 'react';
import navbarService from "../services/navbar"
import sidebarService from "../services/sidebar"
import {Link, useRouteMatch, Switch, Route, useParams} from "react-router-dom"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Project from '../components/Project';
import apiService from '../services/api';
import button from '../logo.svg'

const ProjectPage = (props) => {
  let {project} = useParams();
  let {id} = useParams();
  let {path, url} = useRouteMatch();
  const [organization, setOrganization] = React.useState(null)
  const [edit_enabled, enableEdit] = React.useState(null)

  const [organizations, setOrganizations] = React.useState(null)

  React.useEffect(() => {
    navbarService.setHeading(<>
        <Link class="p-3" to={`/organization/${id}`}>{organization ? organization.name : "PlaceHolder"}</Link>
        <Popup arrow={true} contentStyle={{padding: '0px', border: 'none'}}
               trigger={<button class="w-6 bg-blue-300 rounded-full shadow-outline"><img
                 src="/images/arrow-button-circle-down-1.png"/></button>}>
          <ul>
            {edit_enabled && <li><Link to={`/org-settings/${id}`}>Edit Organization</Link></li>}
            <li>
              <div>Popup content here !!</div>
            </li>
          </ul>

        </Popup>
      </>
    )
  }, [edit_enabled, organization])

  React.useEffect(() => {
    console.log("NAME" + id);

    apiService.getOrgByName(id).then((data) => {
      const resp = data.data
      if (resp.code == "ORGS_RECEIVED") {
        let org = resp.message
        setOrganization(org)
        apiService.hasPermission("edit_org", id.name).then((data) => {
          const resp = data.data
          console.log(JSON.stringify(resp));
          if (resp.code == "HAS_ORG_PERMISSION") {
            enableEdit(true)
          }
        })
          .catch((err) => {
            console.log(err);
          })

      }
    }).catch((err) => console.log(err))

    apiService.getOrgs().then((data) => {
      console.log("ORG DATA: " + JSON.stringify(data.data))
      const resp = data.data
      if (resp.code == "ORGS_RECEIVED_FAILED") {
        return;
      } else if (data.data) {
        setOrganizations(resp.message)
      }
      console.log(data.data[0]);
    }).catch((err) => {
      console.log(err);
    })


    navbarService.setToolbar([<Link to={`/organization/${id}/createProject`}>Create Project</Link>,
      <Link to="/">Home</Link>, <Link to={`/add-user/${id}`}>Add User</Link>])
    sidebarService.setHeader(<div class="relative text-left">
      <h2 class="text-2xl underline"> Recent Projects</h2>
      {/* {data.projects.map((project) => {
                                          return <h3 class="text-lg ml-8" ><Link to={`${url}/project/hello`}>{project.name}</Link></h3>  
                                      })} */}
      <div class="p-5"></div>
      <h2 class="text-2xl underline"> Pinned Projects</h2>
      {/* {data.projects.map((project) => {
                                          return <h3 class="text-lg ml-8" ><Link to="/">{project.name}</Link></h3>  
                                      })} */}
      <div class="p-5"></div>
      <h2 class="text-2xl underline"> All Projects</h2>
      {/* {data.projects.map((project) => {
                                          return <h3 class="text-lg ml-8" ><Link to="/">{project.name}</Link></h3>  
                                      })} */}
    </div>)
  }, [])


  return (
    <div class="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex ">
      <h3 class="text-lg ml-8"><Link to={'/create-mosaic/' + id + '/' + project}>create mosaic</Link></h3>
      <div class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8"> Project's Mosaics
        <div class=" p-1"></div>

        <div class="row">
          {organizations && organizations.map((mos) => (
            <div class="bg-gray-800  shadow-md rounded px-4 pt-3 pb-4">

              <img src={button} alt="Thumbnail Image" width="175" height="175"></img>
              <Link to={`/organization/${mos.name}`}>{mos.name} </Link>
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

export default ProjectPage; 