import { useState } from "react";
import { TextField, Button, Menu, MenuItem } from "@mui/material";
import styles from "./styles/top-bar.module.css";
const TopBar = () => {
  const [
    dropdownButtonSimpleTextOAnchorEl,
    setDropdownButtonSimpleTextOAnchorEl,
  ] = useState(null);
  const dropdownButtonSimpleTextOOpen = Boolean(
    dropdownButtonSimpleTextOAnchorEl
  );
  const handleDropdownButtonSimpleTextOClick = (event) => {
    setDropdownButtonSimpleTextOAnchorEl(event.currentTarget);
  };
  const handleDropdownButtonSimpleTextOClose = () => {
    setDropdownButtonSimpleTextOAnchorEl(null);
  };

  return (
    <div className={styles.topBar}>
      <img className={styles.logoIcon} alt="Logo" src="/logo@2x.png" />
      <TextField
        className={styles.searchbar}
        sx={{ width: 500 }}
        color="primary"
        variant="outlined"
        type="search"
        name="Searchquiz"
        label="Search"
        placeholder="Search for a quiz"
        size="medium"
        margin="none"
        padding="10px"
      />
      <div className={styles.userInfo}>
        <div>
          <Button
            id="button-Gerald Jones"
            aria-controls="menu-Gerald Jones"
            aria-haspopup="true"
            aria-expanded={dropdownButtonSimpleTextOOpen ? "true" : undefined}
            onClick={handleDropdownButtonSimpleTextOClick}
            color="primary"
          >
            <img
              className={styles.userAvatarIcon}
              alt=""
              src="/user-avatar@2x.png"
            />
          </Button>
          <Menu
            anchorEl={dropdownButtonSimpleTextOAnchorEl}
            open={dropdownButtonSimpleTextOOpen}
            onClose={handleDropdownButtonSimpleTextOClose}
          >
            <MenuItem onClick={handleDropdownButtonSimpleTextOClose}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleDropdownButtonSimpleTextOClose}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleDropdownButtonSimpleTextOClose}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
