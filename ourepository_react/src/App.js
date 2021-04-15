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


function App() {


  const protected_routes = [
    {path: "/landing", page: LandingPage},
    {path: "/organization/:id" ,page: OrganizationPage},
    {path: "/org-settings/:id" ,page: OrgSettingsPage},
    {path: "/add-user/:id", page:AddUserPage},
    {path: "/UserStatus", page:UserStatusPage},
    {path: "/create-org", page:CreateOrgPage},
    {path: "/mosaic", page:MosaicPage},
    {path: "/organization/:org/project/:id", page:ProjectPage},
    {path: "/createProject/:id", page:CreateProjectPage}
  ]

  const [protectedRoutes, setProtectedRoutes] = React.useState([])

  React.useEffect(()=>{

    let revealRoutes = async () => {

        let res = await apiService.isAuth()
        
        console.log(res);

        if( res.data == "true"){

          localStorage.setItem("user",true)

          setProtectedRoutes(protected_routes)

        }else{

          localStorage.removeItem("user")

          setProtectedRoutes([])

        }
  
      emitter.addListener("storage", async () => {
          let res = await apiService.isAuth()
          console.log(res);
  
          if( res.data == "true"){
            localStorage.setItem("user",true)

            setProtectedRoutes(protected_routes)
          }else{
            setProtectedRoutes([])
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
          {localStorage.getItem("user") ? <Sidebar></Sidebar> : <></>}




        <Switch>
        <Route exact path="/" >
          {localStorage.getItem("user") ? <Redirect to="/landing" /> : <HomePage></HomePage>}
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
