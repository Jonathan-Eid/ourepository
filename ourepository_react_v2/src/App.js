import React from 'react';
import './App.css';
import LoginPage from './pages/Login';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import emitter from "./services/emitter"

import apiService from "./services/api";
import HomePage from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";
import {ThemeProvider} from "@material-ui/core";
import GlobalStyles from "./components/GlobalStyles";
import theme from "./theme";


function App() {
  const protected_routes = [
    // {path: "/organization/:id", page: HomePage},
    {
      // path: 'app',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '404', element: <HomePage /> }
      ]
    }
  ]

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
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter forceRefresh={true}>
        <Routes>

        {/*<PrivateRoute exact path="/" component={HomePage}/>*/}
          <Route path="/login" element={<LoginPage/>}/>
          {protected_routes.map((parentRoute) => {
            return (
              <Route element={parentRoute.element}>
                {parentRoute.children.map((route) => {
                  return <PrivateRoute path={route.path} element={route.element}/>
                })}
              </Route>
            );
          })}
            {/*{protectedRoutes.map((route) => {*/}
            {/*  return <PrivateRoute path={route.path} component={route.page}/>*/}
            {/*})}*/}
        </Routes>
      </BrowserRouter>

    </ThemeProvider>

  );
}

export default App;
