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
import CreateOrganizationModal from "./CreateOrganizationModal";
import React from "react";

const OrganizationListToolbar = (props) => {

  const [open, setOpen] = React.useState(false);

  const handleCreateOrganizationClick = () => {
    setOpen(!open);
  }

  return (
    <div>
      {open && <CreateOrganizationModal setOpen={handleCreateOrganizationClick} />}
      <Box {...props}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Button>
            Import
          </Button>
          <Button sx={{ mx: 1 }}>
            Export
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleCreateOrganizationClick}
          >
            Create organization
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default OrganizationListToolbar;
