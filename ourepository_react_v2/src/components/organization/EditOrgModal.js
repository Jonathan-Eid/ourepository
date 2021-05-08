import React from 'react';
import { 
    makeStyles
} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from '@material-ui/icons/Folder';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import userApiService from "../../services/userApi";
import emitter from "../../services/emitter";
import {useNavigate} from "react-router-dom";
import organizationApiService from "../../services/organizationApi";
import {indicateRenderSidebar} from "../DashboardSidebar";

let permissions = [
    {
        "title":"Administrator",
        "description": "Grants all permissions",
        "value":"all"
    },{
        "title":"Add Members",
        "description": "Invite users to the organization",
        "value":"add_members"
    },{
        "title":"Delete Members",
        "description": "Delete users from the organization",
        "value":"delete_members"
    },{
        "title":"Add Roles",
        "description": "Add roles to the organization",
        "value":"add_roles"
    },{
        "title":"Delete Roles",
        "description": "Delete roles from the organization",
        "value":"delete_roles"
    },{
        "title":"View Projects",
        "description": "View projects",
        "value":"view_projects"
    },{
        "title":"Create Projects",
        "description": "Create new projects",
        "value":"create_projects"
    },{
        "title":"Share Projects",
        "description": "Create new projects",
        "value":"share_projects"
    },{
        "title":"Delete Projects",
        "description": "Delete projects",
        "value":"delete_projects"
    },{
        "title":"Share Mosaics",
        "description": "Share Mosaics",
        "value":"share_mosaics"
    }
]

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
      width: 1000,
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

export default function EditOrgModal({setOpen, organizationUuid}) {
    const navigate = useNavigate();

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const [projectName, setProjectName] = React.useState(null);
  const [roles, setRoles] = React.useState(null)
  const [active_role, setActiveRole] = React.useState(null)
  const [active_permissions, setActivePermissions] = React.useState([])
  const [changes, setChanges] = React.useState({})
  const [add_view, setAddView] = React.useState(false)
  const [role_name, setRoleName] = React.useState(false)

  const submit = (event) => {
    event.preventDefault();

    organizationApiService.createProject(projectName, organizationUuid).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        indicateRenderSidebar();
        setOpen(false);
        navigate(`/app/project/${data.message.projectUuid}`);
      } else {
        alert(data.message);
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  };

  React.useEffect(() => {
    organizationApiService.getOrgRoles(organizationUuid)
      .then((data) => {
        const resp = data.data
        console.log(JSON.stringify(resp));
        if (resp.code === "SUCCESS") {
          const roles = resp.message.roles
          setRoles(roles)
        }
      })
  }, [add_view])


  React.useEffect(() => {
    if (roles) {
      setActiveRole(roles[0])
    }
  }, [roles])

  React.useEffect(() => {
    setChanges({})
  }, [active_permissions, add_view])

  React.useEffect(() => {
    if (active_role) {
      organizationApiService.getRolePermissions(active_role).then((data) => {
        const resp = data.data
        console.log("PERMISSIONS" + JSON.stringify(resp));

        if (resp.code === "SUCCESS") {
          const permissions = resp.message.roles
          let perms = []
          for (let perm of permissions) {
            perms.push(perm["permission"])
          }
          setActivePermissions(perms)
        }
      })
    }
  }, [active_role])

  function changeActiveRole(idx) {
    setActiveRole(roles[idx])
  }

  function changePermission(event) {
    let target = event.target
    console.log(target.checked);

    const newChanges = Object.assign({}, changes);

    if (newChanges[target.id]) {
      delete newChanges[target.id]
    } else {
      newChanges[target.id] = target.checked
    }

    if (!add_view && target.checked && active_permissions.includes(target.id)) {
      delete newChanges[target.id]
    }

    setChanges(newChanges)
  }

  function submitChanges() {
    organizationApiService.changeRolePermissions(active_role, JSON.stringify(changes))
      .then((data) => {
        const resp = data.data
        console.log("PERMISSIONS" + JSON.stringify(resp));

        if (resp.code === "SUCCESS") {
          setActiveRole(active_role)
        }
      })
      .catch((err) => {
        console.log(err);
      })

  }

  function addView() {
    setAddView(!add_view)
  }

  function addRole() {
    organizationApiService.addRole(role_name, JSON.stringify(changes), organizationUuid)
      .then((data) => {
        const resp = data.data
        console.log("PERMISSIONS" + JSON.stringify(resp));

        if (resp.code === "SUCCESS") {

          setAddView(false)
        }
      })
      .catch((err) => {

      })
  }

  function deleteRole() {
    organizationApiService.deleteRole(active_role)
      .then((data) => {
        const resp = data.data
        console.log("PERMISSIONS" + JSON.stringify(resp));

        if (resp.code === "SUCCESS") {
          setAddView(true)
          setAddView(false)
        }
      })
      .catch((err) => {

      })
  }
  const body = (
    <div style={modalStyle} className={classes.paper}>
    <div class="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex w-3/5">

    <div class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 w-3/4">

    {
      !add_view &&
      <><span class="pr-3">Roles: </span>
        <AddIcon onClick={addView}/>
        <DeleteIcon onClick={deleteRole}/>
      </>

    }

    {
      add_view &&
      <><span class="pr-3">Add Role: </span>
        <CloseIcon onClick={addView}/>
        <CheckIcon onClick={addRole}/>
      </>

    }

    <div class="p-1"></div>

    {!add_view && roles && roles.map((role, idx) => ( 
        <div>    
            <Button onClick={()=>{changeActiveRole(idx)}} variant="contained" color="secondary" component="span" >
                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
            </Button>
            
       </div>
    ))}

    {add_view &&
    <input onChange={(event) => {
      setRoleName(event.target.value)
    }} type="text" class="text-black placeholder-gray-600" placeholder="Enter Role Name"></input>
    }


  </div>

  {add_view && <div class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 w-full">
    Permissions:
    <ul style={{columns: 2}}>
      {permissions.map((permission) => (
        <li>
          <input type="checkbox" id={permission.value} name="permission" onChange={changePermission}
                 checked={changes[permission.value]}/>
          <label class="pl-4" for={permission.value}>
            <span class="text-lg">{permission.title}</span> <br/>
            <span class="text-sm">{permission.description}</span>
          </label>
        </li>
      ))}
    </ul>

  </div>}

  {!add_view && <div class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 w-full">
    Permissions:
    <ul style={{columns: 2}}>
      {permissions.map((permission) => (
        <li>
          <input type="checkbox" id={permission.value} name="permission" onChange={changePermission}
                 checked={(changes[permission.value] != undefined) ? !!changes[permission.value] : !!active_permissions.includes(permission.value)}/>
          <label class="pl-4" for={permission.value}>
            <span class="text-lg">{permission.title}</span> <br/>
            <span class="text-sm">{permission.description}</span>
          </label>
        </li>
      ))}
    </ul>
    <button onClick={submitChanges} disabled={add_view || Object.entries(changes).length === 0}
            class={"rounded text-black border-blue border-4 " + ((add_view || Object.entries(changes).length === 0) ? "bg-blue-50" : "bg-blue-400")}>Change
      Permissions
    </button>

  </div>}

</div>
</div>);

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