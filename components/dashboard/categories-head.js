import { useState, useCallback } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import Categories from "./categories";
import PortalPopup from "./portal-popup";
import styles from "./styles/categories-head.module.css";
import commonStyles from "./styles/common.module.css";
const CategoriesHead = ({ category }) => {
  const [isCategoriesPopupOpen, setCategoriesPopupOpen] = useState(false);
  const [
    dropdownButtonSimpleTextOAnchorEl,
    setDropdownButtonSimpleTextOAnchorEl,
  ] = useState(null);
  const [
    dropdownButtonSimpleTextOSelectedIndex,
    setDropdownButtonSimpleTextOSelectedIndex,
  ] = useState(-1);
  const dropdownButtonSimpleTextOOpen = Boolean(
    dropdownButtonSimpleTextOAnchorEl
  );
  const handleDropdownButtonSimpleTextOClick = (event) => {
    setDropdownButtonSimpleTextOAnchorEl(event.currentTarget);
  };
  const handleDropdownButtonSimpleTextOMenuItemClick = (index) => {
    setDropdownButtonSimpleTextOSelectedIndex(index);
    setDropdownButtonSimpleTextOAnchorEl(null);
  };
  const handleDropdownButtonSimpleTextOClose = () => {
    setDropdownButtonSimpleTextOAnchorEl(null);
  };

  const openCategoriesPopup = useCallback(() => {
    setCategoriesPopupOpen(true);
  }, []);

  const closeCategoriesPopup = useCallback(() => {
    setCategoriesPopupOpen(false);
  }, []);

  return (
    <>
        <div className={styles.categoryInfo}>
          <div className={commonStyles.contentTitle}>{category}</div>
          <div className={styles.sep}>{`| `}</div>
          <div className={styles.categoryTypeSelect}>
            <div>
              <Button
                id="button-Type of asset"
                aria-controls="menu-Type of asset"
                aria-haspopup="true"
                aria-expanded={
                  dropdownButtonSimpleTextOOpen ? "true" : undefined
                }
                onClick={handleDropdownButtonSimpleTextOClick}
                color="primary"
              >
                Type of asset
              </Button>
              <Menu
                anchorEl={dropdownButtonSimpleTextOAnchorEl}
                open={dropdownButtonSimpleTextOOpen}
                onClose={handleDropdownButtonSimpleTextOClose}
              >
                <MenuItem
                  selected={dropdownButtonSimpleTextOSelectedIndex === 0}
                  onClick={() =>
                    handleDropdownButtonSimpleTextOMenuItemClick(0)
                  }
                >
                  Image
                </MenuItem>
                <MenuItem
                  selected={dropdownButtonSimpleTextOSelectedIndex === 1}
                  onClick={() =>
                    handleDropdownButtonSimpleTextOMenuItemClick(1)
                  }
                >
                  Video
                </MenuItem>
                <MenuItem
                  selected={dropdownButtonSimpleTextOSelectedIndex === 2}
                  onClick={() =>
                    handleDropdownButtonSimpleTextOMenuItemClick(2)
                  }
                >
                  Street View
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      {isCategoriesPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0.9)"
          placement="Centered"
          onOutsideClick={false}
        >
          <Categories onClose={closeCategoriesPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default CategoriesHead;
