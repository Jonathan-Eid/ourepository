import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';
import userApiService from "../services/userApi";

const user = {
  // avatar: '/static/images/avatars/avatar_6.png',
  // jobTitle: 'Senior Developer',
  name: 'Placeholder'
};

const organizationsItem = {
  href: '/app/organizations',
  icon: BarChartIcon,
  title: 'Organizations'
}

const items = [
  {
    href: '/app/organizations',
    icon: BarChartIcon,
    title: 'Dashboard',
    items: [
      {
        href: '/app/dashboard',
        icon: BarChartIcon,
        title: 'Dashboard'
      }
    ]
  },
  {
    href: '/app/customers',
    icon: UsersIcon,
    title: 'Customers'
  },
  {
    href: '/app/products',
    icon: ShoppingBagIcon,
    title: 'Products'
  },
  {
    href: '/app/account',
    icon: UserIcon,
    title: 'Account'
  },
  {
    href: '/app/settings',
    icon: SettingsIcon,
    title: 'Settings'
  },
  {
    href: '/login',
    icon: LockIcon,
    title: 'Login'
  },
  {
    href: '/register',
    icon: UserPlusIcon,
    title: 'Register'
  },
  {
    href: '/404',
    icon: AlertCircleIcon,
    title: 'Error'
  }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();

  const [organizationItems, setOrganizationItems] = React.useState(null)

  // get the organizations, projects, and mosaics for the current user
  React.useEffect(() => {
    userApiService.getSidebarOrgs().then((response) => {
      const data = response.data;
      if (data.code === "SIDEBAR_ORGS_RECEIVED") {
        const organizationItems = [];
        data.message.organizations.forEach(organization => {
          const organizationItem = {};
          organizationItem['name'] = organization.name;
          organizationItem['href'] = `/app/organization/${organization.uuid}`;

          const projectItems = [];
          organization.projects.forEach(project => {
            const projectItem = {};
            projectItem['name'] = project.name;
            projectItem['href'] = `/app/project/${project.uuid}`;
            projectItems.push(projectItem);
          })

          organizationItem["items"] = projectItems;
          organizationItems.push(organizationItem);
        })

        setOrganizationItems(organizationItems);
      } else if (data.code === "SIDEBAR_ORGS_RECEIVED_FAILED") {
        alert("Something went wrong");
      }
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        <Avatar
          component={RouterLink}
          src={user.avatar}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64
          }}
          to="/app/account"
        />
        <Typography
          color="textPrimary"
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          <NavItem
            key={organizationsItem.title}
            name="Organizations"
            href="/app/organizations"
            icon={BarChartIcon}
            items={organizationItems}
          />
          {/*{items.map((item) => (*/}
          {/*  <NavItem*/}
          {/*    href={item.href}*/}
          {/*    key={item.title}*/}
          {/*    title={item.title}*/}
          {/*    icon={item.icon}*/}
          {/*    items={item.items}*/}
          {/*  />*/}
          {/*))}*/}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default DashboardSidebar;
