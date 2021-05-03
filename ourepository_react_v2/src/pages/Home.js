import React from 'react';
import navbarService from "../services/navbar"
import {Link, Redirect} from "react-router-dom";
import sidebarSerice from "../services/sidebar"
import emitter from "../services/emitter"
import userApiService from "../services/userApi";

const HomePage = (props) => {

  const [image, setImage] = React.useState("")
  const [organizations, setOrganizations] = React.useState(null)
  // const [authStatus, setAuthStatus] = React.useState(false)

  React.useEffect(() => {
    userApiService.getOrgs().then((data) => {
      const resp = data.data;
      if (resp.code === "ORGS_RECEIVED_FAILED") {

      } else if (data.data) {
        setOrganizations(resp.message);
      }
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  React.useEffect(() => {
    navbarService.setHeading(<Link to="/">OURepository</Link>)
    navbarService.setToolbar([])

  }, []);

  const render = () => {
    // if (!authStatus) {
    //   return (<Redirect to="/login" />);
    // } else {
    //   return (<div>hello</div>);
    // }
    return (<div>hello</div>);
  }

  return (
    render()
    // <>
    //   {!authStatus}
    //
    //   {authStatus && <div class="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex ">
    //
    //     <div class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8"> Your Organizations
    //       <div class=" p-1"></div>
    //
    //       {organizations && organizations.map((org) => (
    //         <div class="bg-gray-800  shadow-md rounded px-4 pt-3 pb-4"><Link
    //           to={`/organization/${org.uuid}`}>{org.name}</Link></div>
    //       ))}
    //
    //     </div>
    //
    //
    //     <div class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8">
    //
    //       <button class="bg-gray-600  shadow-md rounded px-4 pt-3 pb-4"><Link to="/create-org">Create
    //         Organization</Link></button>
    //
    //     </div>
    //
    //
    //   </div>}
    //
    //
    // </>
  );
}
;
export default HomePage;

