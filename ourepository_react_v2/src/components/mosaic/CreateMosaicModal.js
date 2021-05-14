import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from '@material-ui/icons/Image';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup} from "@material-ui/core";
import userApiService from "../../services/userApi";
import emitter from "../../services/emitter";
import {useNavigate} from "react-router-dom";
import BusinessIcon from "@material-ui/icons/Business";
import projectApiService from "../../services/projectApi";
import {startUpload} from "../../resumable2_v2";

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
    width: 400,
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
  formElement: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  fileUploadButton: {
    width: '50%'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    display: 'none',
  },
  verticalFlexBox: {
    display: 'flex',
  }
}));

export default function CreateMosaicModal({setOpen, projectUuid, indicateRenderProjectPage}) {

  const navigate = useNavigate();

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const [mosaicName, setMosaicName] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(null);

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file.");
    } else {
      startUpload(mosaicName, selectedFile, projectUuid, indicateRenderProjectPage);
      setOpen(false);
      // indicateRenderProjectPage();
      // alert("It may take some time for your mosaic to show up. A page refresh will be needed.")
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Avatar className={classes.avatar}>
        <ImageIcon/>
      </Avatar>
      <Typography component="h1" variant="h5">
        {"Create mosaic"}
      </Typography>
      <form className={classes.form} onSubmit={submit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="mosaic-name"
          label="Mosaic Name"
          name="mosaic-name"
          autoFocus
          onInput={e => setMosaicName(e.target.value)}
        />
        <FormGroup className={classes.formElement}>
          <FormLabel>Mosaic</FormLabel>
          <input
            accept="image/tif,, image/tiff, .tiff, .tif"
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={e => setSelectedFile(e.target.files[0])}
            onClick={e => e.target.value = null}
          />
          <label htmlFor="icon-button-file">
            <div>
              <Button classes={classes.fileUploadButton} variant="contained" color="secondary" component="span" startIcon={<CloudUploadIcon />}>
                Select File
              </Button>
              {selectedFile && selectedFile.name}
            </div>
          </label>
        </FormGroup>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          // className={classes.formElement}
        >
          Create mosaic
        </Button>
      </form>
    </div>
  );

  return (
    <div>
      <Modal
        open={true}
        onClose={setOpen}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}