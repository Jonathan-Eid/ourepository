import { useState } from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box, Button,
  Hidden,
  IconButton,
  Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import Logo from './Logo';
import userApiService from "../services/userApi";
import {useCookies} from "react-cookie";

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {

  const navigate = useNavigate();

  const [notifications] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['session_id']);

  return (
    <AppBar
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button onClick={() => {
            userApiService.logout();
            removeCookie("PHPSESSID");
            removeCookie("session_id");
            navigate('/login');
          }} color="inherit">
            Logout
          </Button>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;
