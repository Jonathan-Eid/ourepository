import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactSignupLoginComponent from 'react-signup-login-component';
import LoginPage from './pages/Login';
import Nav from './pages/Nav';
import {Redirect, Route, Switch, BrowserRouter} from "react-router-dom";
import HomePage from './pages/Home';
import LandingPage from './pages/Landing';
import emitter from "./services/emitter"
import Sidebar from './components/Sidebar';
import OrganizationPage from './pages/Organization';
import UserStatusPage from './pages/UserStatus';

import apiService from "./services/api";
import CreateOrgPage from './pages/CreateOrg';
import AddUserPage from './pages/AddUserToOrg';
import OrgSettingsPage from './pages/OrgSettings';
import MosaicPage from './pages/Mosaic';
import ProjectPage from './pages/Project';
import CreateProjectPage from './pages/CreateProject'
import CreateMosaicPage from './pages/CreateMosaic'


function App() {


  const protected_routes = [
    {path: "/organization/:id" ,page: OrganizationPage},
    {path: "/org-settings/:id" ,page: OrgSettingsPage},
    {path: "/add-user/:id", page:AddUserPage},
    {path: "/create-org", page:CreateOrgPage},
    {path: "/UserStatus", page:UserStatusPage},
    {path: "/mosaic/:mosaicUuid", page:MosaicPage},
    {path: "/organization/:org/project/:id", page:ProjectPage},
    {path: "/createProject/:id", page:CreateProjectPage},
    {path: "/create-mosaic/:org/:proj", page: CreateMosaicPage}
  ]

  const [protectedRoutes, setProtectedRoutes] = React.useState([])
  const [authStatus,setAuthStatus] = React.useState(false)


  React.useEffect(()=>{

    let revealRoutes = async () => {

        let res = await apiService.isAuth()
        
        console.log(res);

        if( res.data == "true"){

          localStorage.setItem("user",true)
          setAuthStatus(true)
          setProtectedRoutes(protected_routes)

        }else{

          localStorage.removeItem("user")
          setAuthStatus(false)

          setProtectedRoutes([])

        }
  
      emitter.addListener("storage", async () => {
          let res = await apiService.isAuth()
          console.log(res);
  
          if( res.data == "true"){
            localStorage.setItem("user",true)
            setAuthStatus(true)
            setProtectedRoutes(protected_routes)
          }else{
            setAuthStatus(false)
            setProtectedRoutes([])
            return <Redirect exact to={`/`}></Redirect>
          }

      });

    }
    
    revealRoutes()

    },[])
    
  return (
      <div className="App">

      <BrowserRouter forceRefresh={true}>
        <header className="App-header">
          <Nav></Nav>
          {authStatus ? <Sidebar></Sidebar> : <></>}




        <Switch>
        <Route exact path="/" component={HomePage} >
          {/* {authStatus ? <Redirect to="/landing" /> : <HomePage></HomePage>} */}
        </Route>
        <Route path="/login" component={LoginPage}></Route>
        {protectedRoutes.map((route)=>{

          return <Route path={route.path} component={route.page}></Route>

        })}

        </Switch>

        </header>

        </BrowserRouter>

    </div>

  );
}

export default App;
