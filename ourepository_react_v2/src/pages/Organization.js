import React from 'react';
import navbarService from "../services/navbar"
import sidebarService from "../services/sidebar"
import {Link, useRouteMatch, Switch, Route, useParams} from "react-router-dom"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Project from '../components/Project';
import ProjectPage from './Project'
import organizationApiService from "../services/organizationApi";

const OrganizationPage = (props) => {
  let {id} = useParams();
  let {path, url} = useRouteMatch();
  const [organization, setOrganization] = React.useState(null)
  const [edit_enabled, enableEdit] = React.useState(null)
  const [projects, setProjects] = React.useState(null)

  React.useEffect(() => {
    navbarService.setHeading(<>
        <Link class="p-3" to={`/organization/${id}`}>{organization ? organization.name : ""}</Link>
        <Popup arrow={true} contentStyle={{padding: '0px', border: 'none'}}
               trigger={<button class="w-6 bg-blue-300 rounded-full shadow-outline"><img
                 src="/images/arrow-button-circle-down-1.png"/></button>}>
          <ul>
            {edit_enabled && <li><Link to={`/org-settings/${id}`}>Edit Organization</Link></li>}
          </ul>

        </Popup>
      </>
    )
  }, [edit_enabled, organization])

  React.useEffect(() => {

        organizationApiService.getOrgByUUID(id).then((data) => {
            const resp = data.data
            if(resp.code == "ORGS_RECEIVED"){
                let org = resp.message
                setOrganization(org)
                
                organizationApiService.hasPermission("edit_org",id).then((data)=> {
                    const resp = data.data
                    console.log(JSON.stringify(resp));
                    if(resp.code=="HAS_ORG_PERMISSION"){
                        enableEdit(true) 
                    }
                })
                .catch((err)=> {
                    console.log(err);
                })}
                
        }).catch((err) => console.log(err))

        organizationApiService.getProjects(id)
        .then((data) => {
            console.log("PROJECT DATA: " + JSON.stringify(data.data))
            const resp = data.data
            if (resp.code == "PROJS_RECEIVED_FAILED") {

            } else if (data.data) {
                setProjects(resp.message)
            }
        }).catch((err) => {
            console.log(err);
        })

    navbarService.setToolbar([<Link to={`/createproject/${id}`}>Create Project</Link>, <Link to="/">Home</Link>,
      <Link to={`/add-user/${id}`}>Add User</Link>])

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
      {projects && projects.map((proj) => (
        <h3 class="text-lg ml-8" key={proj.id}><Link
          to={'/organization/' + id + '/project/' + proj.uuid}>{proj.name}</Link></h3>
      ))}
    </div>)

    }, [])

  return (
    <div class="bg-grey-900 shadow-md rounded px-8 pt-6 pb-8 absolute left-0 top-0 pt-32 h-full"
         style={{marginLeft: "16vw", width: "84vw"}}>

      <Switch>
        <Route path={`${path}/project/:project`}>
          <ProjectPage></ProjectPage>


        </Route>
      </Switch>
      <Route exact path={path}>
        Select A Project
      </Route>
      {projects && projects.map((proj) => (
        <h3 class="text-lg ml-8"><Link to={'/organization/' + id + '/project/' + proj.uuid}>{proj.name}</Link></h3>
      ))}
    </div>

  );
};

export default OrganizationPage; 