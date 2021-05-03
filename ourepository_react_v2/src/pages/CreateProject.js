import React from 'react';
import navbarService from "../services/navbar"
import sidebarService from "../services/sidebar"
import Popup from 'reactjs-popup';
import {Link, useRouteMatch, Switch, Route, useParams} from "react-router-dom"
import 'reactjs-popup/dist/index.css';
import {Redirect} from "react-router-dom";
import organizationApiService from "../services/organizationApi";

let permissions = [
  {
    "title": "Add Mosaics",
    "description": "Allow users to add mosaics to the project",
    "value": "add_mosaics"
  }, {
    "title": "Delete Mosaics",
    "description": "Allow users to delete mosaics from this project",
    "value": "delete_mosaics"
  }, {
    "title": "View Mosaics",
    "description": "Allow users to view mosaics in the project",
    "value": "view_mosaics"
  }
]

let permissionTabs = [

  {
    "title": "Default",
    "value": "default",
    "description": "Permissions that everyone in the organization has"
  }, {
    "title": "Whitelist",
    "value": "whitelist",
    "description": "Permissions that chosen Roles and Users have"
  }, {
    "title": "Blacklist",
    "value": "blacklist",
    "description": "Permissions that chosen Roles and Users cannot have"
  }


]

const CreateProjectPage = (props) => {

  let {id} = useParams();
  const [name, setName] = React.useState(null)
  const [activeTab, setActiveTab] = React.useState(permissionTabs[0])
  const [created, setCreated] = React.useState(false)
  const [roles, setRoles] = React.useState(null)
  const [users, setUsers] = React.useState(null)
  const [activeEntity, setEntity] = React.useState("roles")
  const [selectedEntity, setSelectedEntity] = React.useState(null)

  const [changes, setChanges] = React.useState({
    default: {},
    whitelist:{},
    blacklist:{}
  })


  React.useEffect(()=>{
    if(roles){
      setSelectedEntity(roles[0].id)
    }
  },[roles])


  React.useEffect(()=>{

    organizationApiService.getOrgRoles(id)
    .then((data) => {
        const resp = data.data
        console.log(JSON.stringify(resp));
        if(resp.code == "ORG_ROLES_RECEIVED"){
            setRoles(resp.message)
          
        }
    })
    .catch((err)=>{})

    organizationApiService.getOrgUsers(id)
    .then((data) => {
        const resp = data.data
        console.log(JSON.stringify(resp));
        if(resp.code == "ORG_USERS_RECEIVED"){
          let memberRoles = resp.message
          let users  = {}

          for (let memberRole of memberRoles){
            let member = memberRole.member
            if(!users[member.email]){
              users[member.email] = 1
            }
          }

          setUsers(Object.keys(users))
            
        }
    })
    .catch((err)=>{})

  },[])

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
    return <Redirect exact to={'/organization/' + id + '/project/' + name}></Redirect>
  }

  let setTitle = (event) => {
    console.log(event.target.value);
    setName(event.target.value)

  }

  let submitProj = (event) => {
    console.log(event.target.value);
    organizationApiService.createProject(name, id).then((data) => {
      if (data.data.code === "PROJ_CREATED") {
        alert(` Project ' ${name} ' created `)
        setCreated(true)
      } else {
        alert(data.data)
      }


    }).catch((err) => {
      console.log(err);
    })
  }

    let changeTab = (tab) => {

      setActiveTab(tab)
      
    
    }

    let changeEntityType = (event) => {
      setEntity(event.target.value)
      setSelectedEntity(event.target.value == "roles" ? roles[0].id : users[0])

    }

    let selectEntity = (event) => {
      setSelectedEntity(event.target.value)
    }

    let checkPermission = (event) => {
      let target = event.target
  
      const newChanges = Object.assign({}, changes);

      if(activeTab.value != "default" && !newChanges[activeTab.value][selectedEntity]){
        newChanges[activeTab.value][selectedEntity] = {}
      }
      let targetPermissionMap = activeTab.value == "default" ? newChanges[activeTab.value] : newChanges[activeTab.value][selectedEntity]
  
      if (targetPermissionMap[target.id]) {
        delete targetPermissionMap[target.id]
        if(Object.keys(targetPermissionMap).length == 0){
          delete newChanges[activeTab.value][selectedEntity]
        }
      } else {
        targetPermissionMap[target.id] = activeTab.value == "default" ? target.checked : activeEntity
      }

  
      setChanges(newChanges)
    }




      return (
      <div class="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
            <h2 class="text text-black pb-10"> Create A Project </h2>
            <div class="mb-4 text-left">
              <label class="text-2xl text-black text-left"> Enter Project Title</label> 
              <input onChange={setTitle} class="shadow placeholder-blue-500 appearance-none border rounded w-full py-2 px-3 text-black" id="email" type="email" placeholder="Project Title"/>
            </div>
            <div class="pb-4"></div>
            <div class="mb-6 items-left text-left"> 
              
            <label class="text-2xl text-black text-left"> </label> 

            <label class="text-2xl text-black text-left"> </label>


            {permissionTabs.map((tab) => (
              <>
                <button onClick={() => {changeTab(tab)}} class={"p-2 border-gray-900 border-2 " + ((tab.value == activeTab.value) ? "bg-gray-400" : "bg-gray-800")}>{tab.title}</button>
              </>

            ))}

            {
              (activeTab.value == 'whitelist' || activeTab.value == 'blacklist') &&
              <>
              <span class="pr-3"></span>
             { ["roles","users"].map((entity) => (
               <span onChange={changeEntityType}>
                <input checked={activeEntity==entity} type="radio" value={entity} name="entity" /> <span  class="text-black">{entity[0].toUpperCase()+entity.substr(1,)}</span>
                <span class="pr-3"></span>
                </span>
             ))}
              <span class="pr-3"></span>

              <label class="text-2xl text-black text-left"> 

              <select onChange={selectEntity}>
              {(activeEntity=='roles') && roles.map((role) => (
                 <option value={role.id} >{role.name}</option>
             ))}
             {(activeEntity=='users') && users.map((user) => (
                 <option value={user} >{user}</option>
             ))}
              </select> 
              </label>
              </> 
              
            }

            {/* <div class="pb-10"/>  */}

            <ul class="bg-gray-700">
              {permissions.map((permission) => (
                <li>
                  <input checked={(activeTab.value == "default") ? 
                                  changes[activeTab.value][permission.value] 
                                  : changes[activeTab.value][selectedEntity] ? changes[activeTab.value][selectedEntity][permission.value] : false}
                                  onChange={checkPermission} 
                                  type="checkbox" id={permission.value} name="permission"/>
                  <label class="pl-4" for={permission.value}>
                    <span class="text-lg">{permission.title}</span> <br/>
                    <span class="text-sm">{permission.description}</span>
                  </label>
                </li>
              ))}

            </ul>

            <div class="pb-10"/>

            <button onClick={submitProj} class="p-1 rounded-md bg-gradient-to-bl bg-gray-400 hover:bg-blue-900 disabled"
                    disabled={!(name)}> Create
            </button>

          </div>
        </div>
  );
};

export default CreateProjectPage;