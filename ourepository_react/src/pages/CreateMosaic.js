import React from 'react';
import navbarService from "../services/navbar"
import sidebarService from "../services/sidebar"
import Popup from 'reactjs-popup';
import {Link, useRouteMatch, Switch, Route,useParams} from "react-router-dom"
import 'reactjs-popup/dist/index.css';
import apiService from "../services/api"
import {  Redirect } from "react-router-dom";
import { useState } from "react";

const CreateMosaicPage = (props) => {
    
    let { org } = useParams();
    let { proj } = useParams();
    const [visible, setVisible] = React.useState(null)
    const [vis_set, setVis] = React.useState(null)
    const [name, setName] = React.useState(null)
    const [chunks, setChunks] = React.useState(null)
    const [created, setCreated] = React.useState(false)
    const [selectedFile, setSelectedFile] = useState();
	  const [isSelected, setIsSelected] = useState(false);

    let choices =[
      { text: 'Yes', value: true },
      { text: 'No', value: false }
    ]

    const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
      setIsSelected(true);
    };

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
      return <Redirect exact to={'/organization/'+org+"/project/"+proj}></Redirect>
    }

    let setTitle = (event) => {
      console.log(event.target.value);
      setName(event.target.value)

    }

    let setChunk = (event) => {
      setChunks(event.target.value)
    }

    let radioChange = (event) => {
      console.log(event.target.value);
      setVisible(event.target.value);
      setVis(true);
    }

    let submitMos = (event) => {
      /*var formData = new FormData();
      formData.append("chunk", 5);
      formData.append("identifier", selectedFile.identifier);
      formData.append("md5_hash", selectedFile.md5_hash);
      formData.append("part", 50, selectedFile.fileName);*/

      console.log(event.target.value);
      apiService.createMosaic(name,proj,visible,selectedFile,selectedFile.name,selectedFile.size,selectedFile.md5_hash,chunks).then((data) => {
        if(data.data.code == "MOS_CREATED"){
          alert(` Mosaic ' ${name} ' created `)
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
        <h2 class="text text-black pb-10"> Create A Mosaic </h2>
        <div class="mb-4 text-left">
          <label class="text-2xl text-black text-left"> Enter Mosaic Title</label> 
          <input onChange={setTitle} class="shadow  placeholder-blue-500 appearance-none border rounded w-full py-2 px-3  text-black" id="name" type="name" placeholder="Mosaic Title"/>
        </div>
        <div class="mb-6 items-left text-left"> 
        <h3 class="text-black text-xl"> Do you want this mosaic to appear in searches? </h3>
        {choices.map((choice)=> (
          <>
          <input class="" onChange={radioChange}  id="visible" name="visible" type="radio" value={choice.value}/>
          <label class="text-black"> {choice.text} </label>
          <br/></>
          ))}
        <div class="pb-4"></div>
        <button class="p-1 rounded-md bg-gradient-to-bl bg-gray-400 hover:bg-blue-900 disabled" > upload image</button>
        <input type="file" name="file" onChange={changeHandler} />
        </div>
        <div class="mb-4 text-left">
          <label class="text-2xl text-black text-left"> Enter number of chunks</label> 
          <input onChange={setChunk} class="shadow  placeholder-blue-500 appearance-none border rounded w-full py-2 px-3  text-black" id="chunks" type="chunks" placeholder="1"/>
        </div>
        <div class="mb-6 items-left text-left"> 
        <label class="text-2xl text-black text-left"> </label> 
          
          <button onClick={submitMos} class="p-1 rounded-md bg-gradient-to-bl bg-gray-400 hover:bg-blue-900 disabled" disabled={!(name && isSelected)}> Create </button>

        </div>
    </div>
    );
};

export default CreateMosaicPage; 