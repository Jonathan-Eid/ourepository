import React from 'react';
import './App.css';
import LoginPage from './pages/Login';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from './PrivateRoute';

import DashboardLayout from "./components/DashboardLayout";
import {ThemeProvider} from "@material-ui/core";
import GlobalStyles from "./components/GlobalStyles";
import theme from "./theme";
import MainLayout from "./components/MainLayout";
import NotFound from "./pages/NotFound";
import OrganizationList from "./pages/OrganizationList";
import Organization from "./pages/Organization";
import Project from "./pages/Project";
import Mosaic from "./pages/Mosaic";

function App() {
  const protectedRoutes = [
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/app/organizations" /> },
        { path: '/organizations', element: <OrganizationList /> },
        { path: '/organization/:organizationUuid', element: <Organization /> },
        { path: '/project/:projectUuid', element: <Project /> },
        { path: '/mosaic/:mosaicUuid', element: <Mosaic /> },
      ]
    }
  ]

  const unprotectedRoutes = [
    {
      element: <MainLayout />,
      children: [
        { path: '/login', element: <LoginPage /> },
        { path: '/', element: <Navigate to="/app" /> },
        { path: '*', element: <Navigate to="/404" replace={true} /> },
        { path: '/404', element: <NotFound /> }
      ]
    }
  ]

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter forceRefresh={true}>
        <Routes>

          {protectedRoutes.map((parentRoute) => {
            return (
              <PrivateRoute path={parentRoute.path} element={parentRoute.element}>
                {parentRoute.children.map((route) => {
                  return <PrivateRoute path={route.path} element={route.element}/>
                })}
              </PrivateRoute>
            );
          })}
          {unprotectedRoutes.map((parentRoute) => {
            return (
              <Route element={parentRoute.element}>
                {parentRoute.children.map((route) => {
                  return <Route path={route.path} element={route.element}/>
                })}
              </Route>
            );
          })}

        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
