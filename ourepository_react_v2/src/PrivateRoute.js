import React from "react";
import {Redirect, Route} from "react-router-dom";
import apiService from "./services/api";
import emitter from "./services/emitter"

const PrivateRoute = ({component: Component, ...rest}) => {

  const [authStatus, setAuthStatus] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    apiService.isAuth().then((data) => {
      if (data.data === "true") {
        localStorage.setItem("user", "true");
        setAuthStatus(true);
      } else {
        localStorage.removeItem("user");
        setAuthStatus(false)
      }
      setLoading(false);
    }).catch((err) => {
      console.log(err);
    });

    emitter.addListener("storage", async () => {
      let res = await apiService.isAuth();
      if (res.data === "true") {
        localStorage.setItem("user", "true");
        setAuthStatus(true);
      } else {
        setAuthStatus(false);
      }
      setLoading(false);
    });
  }, []);

  const render = () => {
    if (loading) {
      return (<div/>);
    } else {
      return (
        <Route
          {...rest}
          render={props =>
            authStatus ? (
              <Component {...props} />
            ) : (
              <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
            )
          }
        />
      );
    }
  }

  return (
    <div>{render()}</div>
  )
}


export default PrivateRoute;