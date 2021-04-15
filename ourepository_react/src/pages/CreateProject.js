import React from 'react';
import navbarService from "../services/navbar"
import sidebarService from "../services/sidebar"
import Popup from 'reactjs-popup';
import {Link, useRouteMatch, Switch, Route,useParams} from "react-router-dom"
import 'reactjs-popup/dist/index.css';
import apiService from "../services/api"
import {  Redirect } from "react-router-dom";

const CreateOrgPage = (props) => {

    let { id } = useParams();
    const [name, setName] = React.useState(null)
    const [created, setCreated] = React.useState(false)

    React.useEffect(()=>{
        navbarService.setHeading(<>
            <Popup  arrow={true} contentStyle={{ padding: '0px', border: 'none' }} trigger={<button class="w-6 bg-blue-300 rounded-full shadow-outline"><img src="/images/arrow-button-circle-down-1.png" /></button>}>
                <div>Popup content here !!</div>
            </Popup>
            </>
        )
        navbarService.setToolbar([])
        sidebarService.setHeader()
    },[])

    
    if(created){
      return <Redirect exact to={'/organization/'+id}></Redirect>
    }

    let setTitle = (event) => {
      console.log(event.target.value);
      setName(event.target.value)

    }

    let submitProj = (event) => {
      console.log(event.target.value);
      apiService.createProject(name,id).then((data) => {
        if(data.data.code == "PROJ_CREATED"){
          alert(` Project ' ${name} ' created `)
          setCreated(true)
        }
        else{
          alert(data.data)
        }


      }).catch((err) => {
        console.log(err);
      })
    }



      return (
<div class="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
        <h2 class="text text-black pb-10"> Create A Project </h2>
        <div class="mb-4 text-left">
          <label class="text-2xl text-black text-left"> Enter Project Title</label> 
          <input onChange={setTitle} class="shadow  placeholder-blue-500 appearance-none border rounded w-full py-2 px-3  text-black" id="email" type="email" placeholder="Project Title"/>
        </div>
        <div class="pb-4"></div>
        <div class="mb-6 items-left text-left"> 
          
        <label class="text-2xl text-black text-left"> </label> 
          
          <button onClick={submitProj} class="p-1 rounded-md bg-gradient-to-bl bg-gray-400 hover:bg-blue-900 disabled" disabled={!(name)}> Create </button>

        </div>
    </div>
    );
};

export default CreateOrgPage; 