import React from 'react';
import { 
    makeStyles
} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {useNavigate} from "react-router-dom";
import organizationApiService from "../../services/organizationApi";


function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 500,
      // height: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    roleButton: {
      margin: theme.spacing(3, 0, 2),
      width: '50%'
    },
  }));

export default function AddUserModal({setOpen, organizationUuid}) {
    const navigate = useNavigate();

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  
  //let {path, url} = useRouteMatch();
  const [name, setName] = React.useState(null)
  const [created, setCreated] = React.useState(false)
  const [roles, setRoles] = React.useState(null)
  const [selected_role, setSelectedRole] = React.useState(null)


  React.useEffect(()=>{
      organizationApiService.getOrgRoles(organizationUuid)
      .then((data) => {
          const resp = data.data
          console.log(JSON.stringify(resp));
          if(resp.code == "SUCCESS"){
              const roles = resp.message.roles
              setRoles(roles)
              setSelectedRole(roles[0].id)
          }
      })
      .catch((err)=>{})
  },[])

  
  if(created){
    //return <Redirect exact to={`/organization/${id}`}></Redirect>
  }

  let setTitle = (event) => {
    console.log(event.target.value);
    setName(event.target.value)

  }

  let submitAddUser = (event) => {
    console.log(event.target.value);
    organizationApiService.addUser(name,organizationUuid,selected_role).then((data) => {
        console.log(data.data)
      if(data.data.code === "SUCCESS"){
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
  const body = (
    <div style={modalStyle} className={classes.paper}>
    <div class="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/2">
    <h2 class="text text-black pb-10"> Add User to Organization </h2>
    <div class="mb-4 text-left">
      <label class="text-2xl text-black text-left"> Enter email </label> 
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
    </div>
  )

  return (
    <div>
    <Modal
        open={true}
        onClose={setOpen}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
            {body}
      </Modal>
    </div>
  );
}
