import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import emitter from "../services/emitter"
import useMousePosition from "../hooks/useMousePosition";
import {useNavigate, useLocation} from "react-router-dom";
import userApiService from "../services/userApi";

const LoginPage = (props) => {

  let {state} = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const {x, y} = useMousePosition();

  React.useEffect(() => {
    userApiService.isAuth().then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        navigate('/app');
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  }, []);

  const submitSignIn = (event) => {
    event.preventDefault();

    userApiService.loginUser(email, password).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        if (state) {
          navigate(state);
        } else {
          navigate('/app');
        }
      } else {
        alert(response.data.message);
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  };

  const submitSignUp = (event) => {
    event.preventDefault();

    userApiService.createUser(email, givenName, familyName, password, Math.random() * x * y).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        state = null;
        submitSignIn(event);
      } else {
        alert(data.message);
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
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

  const classes = useStyles();

  const renderOtherFields = (isSignUp) => {
    if (isSignUp) {
      return (
        <div>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="given-name"
            label="First Name"
            name="given-name"
            autoComplete="given-name"
            autoFocus
            onInput={e => setGivenName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="family-name"
            label="Last Name"
            name="family-name"
            autoComplete="family-name"
            onInput={e => setFamilyName(e.target.value)}
          />
        </div>
      );
    } else {
      return (<div/>);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignUp ? "Sign up" : "Sign in"}
        </Typography>
        <form className={classes.form} onSubmit={isSignUp ? submitSignUp : submitSignIn}>
          {renderOtherFields(isSignUp)}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            onInput={e => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onInput={e => setPassword(e.target.value)}
          />
          {/*<FormControlLabel*/}
          {/*  control={<Checkbox value="remember" color="primary"/>}*/}
          {/*  label="Remember me"*/}
          {/*/>*/}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Grid container>
            {/*<Grid item xs>*/}
            {/*  <Link href="#" variant="body2">*/}
            {/*    Forgot password?*/}
            {/*  </Link>*/}
            {/*</Grid>*/}
            <Grid item>
              <Link onClick={() => setIsSignUp(!isSignUp)} variant="body2">
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default LoginPage;