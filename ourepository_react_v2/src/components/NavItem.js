import {
  NavLink as RouterLink,
  matchPath,
  useLocation
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Button, Collapse, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {StarBorder} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const NavItem = ({
  href,
  icon: Icon,
  title,
  items,
  ...rest
}) => {
  const location = useLocation();

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));

  const classes = useStyles();

  const active = href ? !!matchPath({
    path: href,
    end: false
  }, location.pathname) : false;

  return (
    <div>
      <ListItem
        disableGutters
        sx={{
          display: 'flex',
          py: 0
        }}
        {...rest}
      >
        <Button
          component={RouterLink}
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
            justifyContent: 'flex-start',
            letterSpacing: 0,
            py: 1.25,
            textTransform: 'none',
            width: '100%',
            ...(active && {
              color: 'primary.main'
            }),
            '& svg': {
              mr: 1
            }
          }}
          to={href}
        >
          {Icon && (
            <Icon size="20" />
          )}
          <span>
            {title}
          </span>
        </Button>
      </ListItem>
      <Collapse in={true} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

export default NavItem;
