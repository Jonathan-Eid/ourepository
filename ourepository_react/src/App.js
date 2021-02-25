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


function App() {


  const protected_routes = [
    {path: "/landing", page: LandingPage},
    {path: "/organization/:id" ,page: OrganizationPage},
    {path: "/UserStatus", page:UserStatusPage}
  ]

  const [protectedRoutes, setProtectedRoutes] = React.useState([])

  React.useEffect(()=>{

    let user_token = localStorage.getItem('user')

    let revealRoutes = async () => {
      if (user_token) {
        let res = await apiService.isAuth(user_token)
        console.log(res);

        if( res.data == "true"){
          setProtectedRoutes(protected_routes)
        }else{
          setProtectedRoutes([])
        }
      }else{
        setProtectedRoutes([])
      }
  
      emitter.addListener("storage", async () => {
        if (user_token) {
          let res = await apiService.isAuth(user_token)
          console.log(res);
  
          if( res.data == "true"){
            setProtectedRoutes(protected_routes)
          }else{
            setProtectedRoutes([])
          }
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
