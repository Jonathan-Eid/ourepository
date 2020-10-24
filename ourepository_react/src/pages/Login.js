import React from 'react';
import ReactSignupLoginComponent from 'react-signup-login-component';
import { withRouter , Redirect, Link } from "react-router-dom";
import emitter from "../services/emitter"

const LoginPage = (props) => {

    const [signUp, setSignUp] = React.useState(false)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    let button;

    function handleBackClick() {
      setSignUp(false)
  }

    function handleSubmitClick() {
        setSignUp(false)
    }
  
    function handleSignUpClick() {
      setSignUp(true)
    }
    function handleSignInClick() {
      if(username+password=="adminadmin"){
        localStorage.setItem("user","true")     
        setSignUp(true)
        emitter.emit("storage")
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
          <input onChange={event => setUsername(event.target.value)} class="shadow appearance-none border rounded w-full py-2 px-3  text-black" id="username" type="text" placeholder="Username"/>
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