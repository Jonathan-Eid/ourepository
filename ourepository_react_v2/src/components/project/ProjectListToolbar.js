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

const ProjectListToolbar = (props) => {

  const [open, setOpen] = React.useState(false);

  const handleCreateProjectClick = () => {
    setOpen(!open);
  }

  return (
    <div>
      {open && <CreateProjectModal setOpen={handleCreateProjectClick} />}
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
