import React from 'react';
import navbarService from "../services/navbar"
import sidebarService from "../services/sidebar"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {Link, Redirect, useRouteMatch, Switch, Route, useParams} from "react-router-dom"
import ManageRoles from '../components/ManageRoles';
import AddUser from '../components/AddUser';
import organizationApiService from "../services/organizationApi";


const OrgSettingsPage = (props) => {

  let {id} = useParams();

    let tabs = [ 
        {
            "header":"Manage Roles",
            "component": <ManageRoles id={id}></ManageRoles>
        },
        {
            "header":"Manage Users",
            "component": <AddUser id={id}></AddUser>
        }

  ]

  const [active_tab, setTab] = React.useState(tabs[0])
  const [organization, setOrganization] = React.useState(null)


  React.useEffect(() => {


    organizationApiService.getOrganization(id).then((data) => {
      const resp = data.data
      if(resp.code == "ORGS_RECEIVED"){
          let org = resp.message
          setOrganization(org)
      }
    }).catch((err) => console.log(err))
    
    sidebarService.setHeader("Options")
    sidebarService.setContent(<>
      {tabs.map((tab => (
        <div class="bg-gray-800 border-white border shadow-md rounded px-4 pt-3 pb-4"> {tab['header']}</div>
      )))}
    </>)
  }, [])

    React.useEffect(()=>{
        navbarService.setHeading(<>
            <Link class="p-3" to={`/organization/${id}`}>{organization ? organization.name : ""}</Link>
            </>
        )
        sidebarService.setHeader(<u>Options</u>)
        sidebarService.setContent(<>
        <div class="pb-5"></div>
            {tabs.map((tab => (
                <div onClick={()=>{changeTab(tab)}} class="border-white border shadow-md rounded px-4 pt-3 pb-4 hover:bg-gray-200 "> {tab['header']}</div>
            )))}
        </>)
    },[organization])

    function changeTab(tab){
        setTab(tab)
    }


    return (
        <>
        <div class={"pb-28"}></div>
        {active_tab['component']}
        </>
    );

};

export default OrgSettingsPage; 