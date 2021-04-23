import React from 'react';
import ReactSignupLoginComponent from 'react-signup-login-component';
import navbarService from "../services/navbar"
import { withRouter , Redirect, Link } from "react-router-dom";
import sidebarSerice from "../services/sidebar"
import apiService from "../services/api"
import emitter from "../services/emitter"

const HomePage = (props) => {

  const [image, setImage] = React.useState("")
  const [organizations, setOrganizations] = React.useState(null)
  const [authStatus, setAuthStatus] = React.useState(false)

  React.useEffect(()=>{
    navbarService.setHeading(<Link to="/">OURepository</Link>)
    navbarService.setToolbar([])
    sidebarSerice.setHeader(<></>)

    apiService.getOrgs().then((data) => {
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
    })


    let setAuth = async () => {

      let res = await apiService.isAuth()
      
      console.log(res);

      if( res.data == "true"){

        localStorage.setItem("user",true)
        setAuthStatus(true)

      }else{

        localStorage.removeItem("user")
        setAuthStatus(false)


      }

    emitter.addListener("storage", async () => {
        let res = await apiService.isAuth()
        console.log(res);

        if( res.data == "true"){
          localStorage.setItem("user",true)
          setAuthStatus(true)

        }else{
          setAuthStatus(false)
        }

    });

  }
  
  setAuth()


  },[])

  React.useEffect(()=>{
    navbarService.setHeading(<Link to="/">OURepository</Link>)
    navbarService.setToolbar([])

},[])

  return (<>
      {!authStatus && <div class="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        OURepository
    </div>}

    {authStatus && <div class="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex ">

      <div class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8"> Your Organizations
      <div class=" p-1"></div>

      {organizations && organizations.map((org) => ( 
        <div class="bg-gray-800  shadow-md rounded px-4 pt-3 pb-4"><Link to={`/organization/${org.uuid}`}>{org.name}</Link> </div>
      ))}

      </div>


      <div class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8">

      <button class="bg-gray-600  shadow-md rounded px-4 pt-3 pb-4"><Link to="/create-org">Create Organization</Link> </button>

      </div>


      </div>}


    </>
    );
  };
export default HomePage;

