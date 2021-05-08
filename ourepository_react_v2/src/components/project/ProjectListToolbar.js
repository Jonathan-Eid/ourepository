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
import EditOrgModal from "../organization/EditOrgModal";
import {useParams} from "react-router-dom";
import organizationApiService from "../../services/organizationApi";

const ProjectListToolbar = (props) => {

  const {organizationUuid} = useParams();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [canEditOrg, setCanEditOrg] = React.useState(true);

  const handleCreateProjectClick = () => {
    setOpen(!open);
  }

  const hasAdmin = () => {
    organizationApiService.getProjects(organizationUuid).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        setCanEditOrg(true);
      }
      
    })
  }

  const handleEditOrgClick = () => {
    setOpenEdit(!openEdit)
  }

  React.useEffect(() => {
    hasAdmin();
  },[])

  return (
    <div>
      {open && <CreateProjectModal setOpen={handleCreateProjectClick} organizationUuid={organizationUuid} />}
      {openEdit && <EditOrgModal setOpen={handleEditOrgClick} organizationUuid={organizationUuid} />}
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
