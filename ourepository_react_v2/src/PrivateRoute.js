import React from "react";
import {Route, useNavigate} from "react-router-dom";
import emitter from "./services/emitter"
import userApiService from "./services/userApi";


const PrivateRoute = ({element: Component, path, ...rest}) => {

  const navigate = useNavigate();

  const [authStatus, setAuthStatus] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    userApiService.isAuth().then((data) => {
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
      let res = await userApiService.isAuth();
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
      if (authStatus) {
        return (<Route path={path} element={Component} />);
        // return (
        //   <Route
        //     {...rest}
        //     render={props => (
        //         <Component {...props} />
        //       )
        //     }
        //   />
        // );
      } else {
        navigate('/login');
      }

    }
  }

  return (
    <div>{render()}</div>
  )
}


export default PrivateRoute;