import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import React from "react";
import CreateProjectModal from "./CreateProjectModal";
import AddUserModal from "../organization/AddUserModal";
import EditOrgModal from "../organization/EditOrgModal";
import {useParams} from "react-router-dom";
import organizationApiService from "../../services/organizationApi";

const ProjectListToolbar = (props) => {

  const {organizationUuid} = useParams();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [canEditOrg, setCanEditOrg] = React.useState(false);
  const [canAddUsers, setCanAddUsers] = React.useState(false);

  const handleCreateProjectClick = () => {
    setOpen(!open);
  }

  const hasAdmin = () => {
    organizationApiService.hasPermission("EDIT_ORG",organizationUuid).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        setCanEditOrg(true);
      }
      
    })
  }

  const hasAdd = () => {
    organizationApiService.hasPermission("ADD_MEMBERS",organizationUuid).then((response) => {
      console.log(response.data);
      const data = response.data;
      if (data.code === "SUCCESS") {
        setCanAddUsers(true);
      }
    })
  }

  const handleEditOrgClick = () => {
    setOpenEdit(!openEdit)
  }

  const handleAddUserClick = () => {
    setOpenAdd(!openAdd)
  }

  React.useEffect(() => {
    hasAdmin();
    hasAdd();
  },[])

  return (
    <div>
      {open && <CreateProjectModal setOpen={handleCreateProjectClick} organizationUuid={organizationUuid} />}
      {openEdit && <EditOrgModal setOpen={handleEditOrgClick} organizationUuid={organizationUuid} />}
      {openAdd && <AddUserModal setOpen={handleAddUserClick} organizationUuid={organizationUuid} />}
      <Box {...props}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          {canEditOrg &&
          <Button onClick={handleEditOrgClick}>
            Edit Organization
          </Button>}
          {canAddUsers && 
          <Button onClick={handleAddUserClick}>
            Add User
          </Button>}
          <Button>
            Import
          </Button>
          <Button sx={{ mx: 1 }}>
            Export
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleCreateProjectClick}
          >
            Create project
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default ProjectListToolbar;
