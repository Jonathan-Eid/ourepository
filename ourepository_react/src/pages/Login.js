import React from 'react';
import ReactSignupLoginComponent from 'react-signup-login-component';
import { withRouter , Redirect, Link } from "react-router-dom";
import emitter from "../services/emitter"
import apiService from "../services/api"
import useMousePosition from "../hooks/useMousePosition"; 
import { useCookies } from 'react-cookie';
const { REACT_APP_PHP_DOMAIN,REACT_APP_PHP_PORT } = process.env;

const LoginPage = (props) => {

    const [cookies, setCookie, removeCookie] = useCookies(['session_id']);
    const [signUp, setSignUp] = React.useState(false)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const { x, y } = useMousePosition();

    let button;

    function handleBackClick() {
      setSignUp(false)
  }

    async function handleSubmitClick() {
      try{
        console.log(x*y);
        const res = await apiService.createUser(username,password,Math.random()*x*y)
        console.log(res);
        if(res.data.code=="user_exists"){
          alert(res.data.message)
        }
        if(res.data.code == "created_user"){
          localStorage.setItem("user",res.data.message) 
          emitter.emit("storage")    
        }
      }catch(err){
        console.log(err);
      }

        setSignUp(false)
    }
  
    function handleSignUpClick() {
      setSignUp(true)
    }

    async function handleSignInClick() {
      try{
        console.log(REACT_APP_PHP_DOMAIN, REACT_APP_PHP_PORT)
        const res = await apiService.loginUser(username,password)
      
        console.log(res);

        setCookie("session_id",res.data);

        if(res.data.code=="hash_matches"){
          localStorage.setItem("user",res.data.message)     
          setSignUp(true)
          alert("Successfully logged in")
        }

      }
      catch(err){
        console.log(err);
      }

    }

    if(localStorage.getItem("user")){
      return <Redirect exact to="/"></Redirect>
    }

    if (!signUp) {
      button =           <>
                  <button onClick={handleSignInClick} class="bg-blue hover:bg-blue-dark text-black border-2 border-blue-300 font-bold py-2 px-4 rounded" type="button">
                    Sign In
                  </button>
                  <button onClick={handleSignUpClick} class="bg-blue hover:bg-blue-dark text-black border-2 border-blue-300 font-bold py-2 px-4 rounded" type="button">
                    Sign Up
                  </button></>
    } else {
      button =     <>      
      
        <button onClick={handleSubmitClick} class="bg-blue hover:bg-blue-dark text-black border-2 border-blue-300 font-bold py-2 px-4 rounded" type="button">
          Submit
        </button>
        <button onClick={handleBackClick} class="bg-blue hover:bg-blue-dark text-black border-2 border-blue-300 font-bold py-2 px-4 rounded" type="button">
          Back
        </button></>
    }
    const signupWasClickedCallback = (data) => {
        console.log(data);
        alert('Signup callback, see log on the console to see the data.');
      };
      const loginWasClickedCallback = (data) => {
        console.log(data);
        alert('Login callback, see log on the console to see the data.');
      };
      const recoverPasswordWasClickedCallback = (data) => {
        console.log(data);
        alert('Recover password callback, see log on the console to see the data.');
      };
      return (
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div class="mb-4">
          <input onChange={event => setUsername(event.target.value)} class="shadow appearance-none border rounded w-full py-2 px-3  text-black" id="username" type="email" placeholder="Username"/>
        </div>
        <div class="mb-6">
          <input onChange={event => setPassword(event.target.value)} class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-black mb-3" id="password" type="password" placeholder="Password"/>
          <p class="text-red text-xs italic">Please choose a password.</p>
        </div>
        <div class="flex items-center justify-between">
          {button}
          <a class="inline-block align-baseline font-bold text-sm text-black hover:text-blue-darker " href="#">
            Forgot Password?
          </a>
        </div>
    </div>
    );
};

export default LoginPage;