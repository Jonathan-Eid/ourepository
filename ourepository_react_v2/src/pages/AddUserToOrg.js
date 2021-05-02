import React from 'react';
import navbarService from "../services/navbar"
import sidebarService from "../services/sidebar"
import {Link, useRouteMatch, Switch, Route, useParams} from "react-router-dom"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import apiService from "../services/api"
import {Redirect} from "react-router-dom";

const AddUserPage = (props) => {
  let {id} = useParams();
  let {path, url} = useRouteMatch();
  const [name, setName] = React.useState(null)
  const [role, setRole] = React.useState(null)
  const [created, setCreated] = React.useState(false)

  React.useEffect(() => {
    navbarService.setHeading(<>
        <Popup arrow={true} contentStyle={{padding: '0px', border: 'none'}}
               trigger={<button class="w-6 bg-blue-300 rounded-full shadow-outline"><img
                 src="/images/arrow-button-circle-down-1.png"/></button>}>
          <div>Popup content here !!</div>
        </Popup>
      </>
    )
    navbarService.setToolbar([])
    sidebarService.setHeader()
  }, [])


  if (created) {
    return <Redirect exact to='/organization/${id}'></Redirect>
  }

  let setTitle = (event) => {
    console.log(event.target.value);
    setName(event.target.value)

  }

  let setRoleInOrg = (event) => {
    console.log(event.target.value);
    setRole(event.target.value)
  }

  let submitAddUser = (event) => {
    console.log(event.target.value);
    apiService.addUser(name, id, role).then((data) => {
      if (data.data.code == "USER_ADDED") {
        alert(` user: ' ${name} ' added to organization `)
        setCreated(true)
      } else {
        alert(data.data.code)
      }


    }).catch((err) => {
      console.log(err);
    })
  }


  return (
    <div class="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
      <h2 class="text text-black pb-10"> Add User to Organization </h2>
      <div class="mb-4 text-left">
        <label class="text-2xl text-black text-left"> Enter email</label>
        <input onChange={setTitle}
               class="shadow  placeholder-blue-500 appearance-none border rounded w-full py-2 px-3  text-black"
               id="email" type="email" placeholder="User email"/>
      </div>
      <div class="mb-4 text-left">
        <label class="text-2xl text-black text-left"> Enter Role in organization</label>
        <input onChange={setRoleInOrg}
               class="shadow  placeholder-blue-500 appearance-none border rounded w-full py-2 px-3  text-black"
               id="role" type="role" placeholder="Organization role"/>
      </div>
      <div class="pb-4"></div>
      <div class="mb-6 items-left text-left">
        <button onClick={submitAddUser}
                class="p-1 rounded-md bg-gradient-to-bl bg-gray-400 hover:bg-blue-900 disabled"> Add
        </button>

      </div>
    </div>
  );
};

export default AddUserPage; 