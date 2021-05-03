import {matchPath, NavLink as RouterLink, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Button, Collapse, List, ListItem} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

const NavItem = ({
                   href = "/app/organization",
                   icon: Icon,
                   name,
                   items = null,
                   spacing = 2,
                   ...rest
                 }) => {
  const location = useLocation();

  const [open, setOpen] = React.useState(true);

  const handleOpenClick = (event) => {
    event.stopPropagation();
    setOpen(!open);
  }

  const useStyles = makeStyles((theme) => ({
    nested: {
      paddingLeft: theme.spacing(spacing),
    },
  }));

  const classes = useStyles();

  const active = href ? !!matchPath({
    path: href,
    end: false
  }, location.pathname) : false;

  const renderExpand = () => {
    if (items) {
      if (open) {
        return <ExpandLess onClick={handleOpenClick}/>
      } else {
        return <ExpandMore onClick={handleOpenClick}/>
      }
    } else {
      return <div/>
    }
  }

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
          // component={RouterLink}
          onClick={(() => alert("helllo"))}
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
          // to={href}
        >
          {Icon && (
            <Icon size="20"/>
          )}
          <span>
            {name}
          </span>
          {renderExpand()}
        </Button>
      </ListItem>
      {items && items.map((item) => (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavItem
              className={classes.nested}
              // href={organizationsItem.href}
              key={item.name}
              name={item.name}
              icon={Icon}
              items={item.items}
              spacing={spacing + 2}
              // organization={element}
            />
          </List>
        </Collapse>
      ))}
    </div>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

export default NavItem;
