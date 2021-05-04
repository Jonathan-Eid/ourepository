import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from '@material-ui/icons/Folder';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import userApiService from "../../services/userApi";
import emitter from "../../services/emitter";
import {useNavigate} from "react-router-dom";

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
  // paper: {
  //   position: 'absolute',
  //   marginTop: theme.spacing(8),
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  // },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function CreateProjectModal({setOpen}) {

  const navigate = useNavigate();

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const [projectName, setProjectName] = React.useState(null)
  const [visible, setVisible] = React.useState(false)

  const submit = async (event) => {
    try {
      event.preventDefault();

      // const res = await userApiService.createOrg(projectName, visible);
      // if (res.data.code === "ORG_CREATED") {
      //   setOpen(false);
      //   navigate(`/app/project/${res.data.message.projectUuid}`);
      // } else {
      //   alert("An error occurred");
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Avatar className={classes.avatar}>
        <FolderIcon/>
      </Avatar>
      <Typography component="h1" variant="h5">
        {"Create project"}
      </Typography>
      <form className={classes.form} onSubmit={submit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="project-name"
          label="Project Name"
          name="project-name"
          autoFocus
          onInput={e => setProjectName(e.target.value)}
        />
        <RadioGroup className={classes.form} name="visible" value={visible} defaultValue={false} onChange={e => setVisible(e.target.value === "true")}>
          <FormControlLabel value={false} control={<Radio />} label="No" />
          <FormControlLabel value={true} control={<Radio />} label="Yes" />
        </RadioGroup>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Create project
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