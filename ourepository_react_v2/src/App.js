import React from 'react';
import './App.css';
import LoginPage from './pages/Login';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import HomePage from './pages/Home';
import emitter from "./services/emitter"

import apiService from "./services/api";


function App() {
  const protected_routes = []

  const [protectedRoutes, setProtectedRoutes] = React.useState([])
  const [authStatus, setAuthStatus] = React.useState(false)


  React.useEffect(() => {

    let revealRoutes = async () => {
      let res = await apiService.isAuth()

      if (res.data === "true") {
        localStorage.setItem("user", true)
        setAuthStatus(true)
        setProtectedRoutes(protected_routes)
      } else {
        localStorage.removeItem("user")
        setAuthStatus(false)
        setProtectedRoutes([])
      }

      emitter.addListener("storage", async () => {
        let res = await apiService.isAuth()

        if (res.data === "true") {
          localStorage.setItem("user", true)
          setAuthStatus(true)
          setProtectedRoutes(protected_routes)
        } else {
          setAuthStatus(false)
          setProtectedRoutes([])
        }
      });

    }

    revealRoutes()
  }, [])

  return (
    <div className="App">
      <BrowserRouter forceRefresh={true}>
        <Switch>
          <PrivateRoute exact path="/" component={HomePage}/>
          <Route path="/login" component={LoginPage}/>
          {protectedRoutes.map((route) => {
            return <PrivateRoute path={route.path} component={route.page}/>
          })}
        </Switch>
      </BrowserRouter>

    </div>

  );
}

export default App;
