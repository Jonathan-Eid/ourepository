import React from "react";
import {Route, useNavigate, useLocation} from "react-router-dom";
import emitter from "./services/emitter"
import userApiService from "./services/userApi";
import {alertClasses} from "@material-ui/core";


const PrivateRoute = ({element: Component, path}) => {

  const location = useLocation();
  const navigate = useNavigate();

  const [authStatus, setAuthStatus] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    userApiService.isAuth().then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        setAuthStatus(true);
      } else {
        setAuthStatus(false)
      }
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  }, []);

  const render = () => {
    if (loading) {
      return (<><div>LOADING</div></>);
    } else {
      if (authStatus) {
        return (<Route path={path} element={Component} />);
      } else {
        navigate('/login', {state: location.pathname});
      }
    }
  }

  return (
    <div>{render()}</div>
  )
}


export default PrivateRoute;