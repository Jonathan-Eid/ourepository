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
import MainLayout from "./components/MainLayout";
import NotFound from "./pages/NotFound";

function App() {
  const protectedRoutes = [
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <HomePage /> },
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
              <Route path={parentRoute.path} element={parentRoute.element}>
                {parentRoute.children.map((route) => {
                  return <PrivateRoute path={route.path} element={route.element}/>
                })}
              </Route>
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
