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
import CreateMosaicModal from "./CreateMosaicModal";
import {useParams} from "react-router-dom";
import organizationApiService from "../../services/organizationApi";
import projectApiService from "../../services/projectApi";

const MosaicListToolbar = ({indicateRenderProjectPage}) => {

  const {projectUuid} = useParams();
  const [organizationUuid, setOrganizationUuid] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [canCreateMos, setCanCreateMos] = React.useState(false);

  const handleCreateMosaicClick = () => {
    setOpen(!open);
  }

  const hasCreate = () => {
    projectApiService.getOrg(projectUuid).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        organizationApiService.hasPermission("CREATE_MOSAICS",data.message.orgUuid).then((response) => {
          const data = response.data;
          console.log(data)
          if (data.code === "SUCCESS") {
            setCanCreateMos(true);
          }
        })
      }
    })
  }

  React.useEffect(() => {
    hasCreate()
  },[])

  return (
    <div>
      {open && <CreateMosaicModal
        setOpen={handleCreateMosaicClick}
        projectUuid={projectUuid}
        indicateRenderProjectPage={indicateRenderProjectPage}
      />}
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          {canCreateMos &&
          <Button>
            Import
          </Button>}
          {canCreateMos &&
          <Button sx={{ mx: 1 }}>
            Export
          </Button>}
          {canCreateMos &&
          <Button
            color="primary"
            variant="contained"
            onClick={handleCreateMosaicClick}
          >
            Upload mosaic
          </Button>}
        </Box>
      </Box>
    </div>
  );
}

export default MosaicListToolbar;
