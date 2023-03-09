import "./Dropdown.css";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export default function Dropdown(props) {
  const { anchorEl, handlers, menuItems = [] } = props;

  const open = Boolean(anchorEl);

  return (
    <div className="dropdown">
      <Menu
        className="dropdown__main"
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handlers.onCloseHandler}
      >
        {menuItems.length > 0 &&
          menuItems.map((menuItem, index) => {
            const Icon = menuItem.icon;

            return (
              <MenuItem
                className="dropdown__item"
                onClick={(event) => {
                  handlers.onDropdownItemClick(event, menuItem, index);
                }}
                key={index}
              >
                {Boolean(menuItem.icon) && (
                  <Icon className="dropdown__item-icon" />
                )}
                <Typography className="dropdown__item-text">
                  {menuItem.name}
                </Typography>
              </MenuItem>
            );
          })}
        {props.children}
      </Menu>
    </div>
  );
}
