import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { TextField, Button, Menu, MenuItem } from "@mui/material";
import styles from "./styles/top-bar.module.css";
import { getAuth, signOut } from "firebase/auth";

const TopBar = () => {
  const auth = getAuth();
  const router = useRouter();

  const logout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      router.replace('/login');
    }).catch((error) => {
      // An error happened.
    });
  }


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

  const logoutClick = () => {
    handleDropdownButtonSimpleTextOClose();
    logout();
  }

  return (
    <div className={styles.topBar}>
      <Image className={styles.logoIcon} width={100} height={100} alt="Logo" src="/logo@2x.png" />
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
            <Image
              className={styles.userAvatarIcon}
              width={100} height={100}
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
              <Link href='/dashboard'>Dashboard</Link>
            </MenuItem>
            <MenuItem onClick={handleDropdownButtonSimpleTextOClose}>
              Settings
            </MenuItem>
            <MenuItem onClick={logoutClick}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
