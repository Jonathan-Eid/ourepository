import React from 'react';
import navbarService from "../services/navbar"
import sidebarService from "../services/sidebar"
import {Link, useRouteMatch, Switch, Route,useParams} from "react-router-dom"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import apiService from "../services/api"
import {  Redirect } from "react-router-dom";

const AddUser = (props) => {
    let { id } = useParams();
    let {path, url} = useRouteMatch();
    const [name, setName] = React.useState(null)
    const [created, setCreated] = React.useState(false)
    const [roles, setRoles] = React.useState(null)
    const [selected_role, setSelectedRole] = React.useState(null)


    React.useEffect(()=>{
        apiService.getOrgRoles(props.id)
        .then((data) => {
            const resp = data.data
            console.log(JSON.stringify(resp));
            if(resp.code == "ORG_ROLES_RECEIVED"){
                const roles = resp.message
                setRoles(roles)
                setSelectedRole(roles[0].id)
            }
        })
        .catch((err)=>{})
    },[])

    
    if(created){
      return <Redirect exact to={`/organization/${id}`}></Redirect>
    }

    let setTitle = (event) => {
      console.log(event.target.value);
      setName(event.target.value)

    }

    let submitAddUser = (event) => {
      console.log(event.target.value);
      apiService.addUser(name,id,selected_role).then((data) => {
        if(data.data.code == "USER_ADDED"){
          alert(` user: ' ${name} ' added to organization `)
          setCreated(true)
        }
        else{
          alert(data.data)
        }
 

      }).catch((err) => {
        console.log(err);
      })
    }

    function selectRole(event){
        console.log(event.target.value)
        setSelectedRole(event.target.value)
    }



      return (
    <div class="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
        <h2 class="text text-black pb-10"> Add User to Organization </h2>
        <div class="mb-4 text-left">
          <label class="text-2xl text-black text-left"> Enter email</label> 
          <input onChange={setTitle} class="shadow  placeholder-blue-500 appearance-none border rounded w-full py-2 px-3  text-black" id="email" type="email" placeholder="User email"/>
        </div>
        <div class="mb-4 text-left">
          <label class="text-2xl text-black text-left"> Select Role for User 
          {/* <input onChange={setRoleInOrg} class="shadow  placeholder-blue-500 appearance-none border rounded w-full py-2 px-3  text-black" id="role" type="role" placeholder="Organization role"/> */}
         <select onChange={selectRole}>
             {roles && roles.map((role) => (
                 <option value={role.id} >{role.name}</option>
             ))}
         </select>
         </label> 
        </div>
        <div class="pb-4"></div>
        <div class="mb-6 items-left text-left"> 
          <button onClick={submitAddUser} class="p-1 rounded-md bg-gradient-to-bl bg-gray-400 hover:bg-blue-900 disabled" > Add </button>

        </div>
    </div>
    );
};

export default AddUser; 