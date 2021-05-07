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

const MosaicListToolbar = ({indicateRenderProjectPage}) => {

  const {projectUuid} = useParams();
  const [open, setOpen] = React.useState(false);

  const handleCreateMosaicClick = () => {
    setOpen(!open);
  }

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
          <Button>
            Import
          </Button>
          <Button sx={{ mx: 1 }}>
            Export
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleCreateMosaicClick}
          >
            Upload mosaic
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default MosaicListToolbar;
