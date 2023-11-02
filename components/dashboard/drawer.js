import { useEffect, useState, forwardRef } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import styles from "./styles/drawer.module.css";

// Use forwardRef so that the button ref can be used in parent components. 
// See https://react.dev/reference/react/forwardRef
const SlideDrawer = forwardRef(function SlideDrawer({ children, label, anchor, style, remoteOpen}, ref) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    if (!remoteOpen) setState({ ...state, [anchor]: open });
  };

  return (
    <div>
        <Button ref={ref} className={styles[style]} onClick={toggleDrawer(anchor, true)}>{label}</Button>
        <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
        >
            <div className={styles.closeButton}>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={toggleDrawer(anchor, false)}
                    aria-label="close"
                >
                    <CancelRoundedIcon size={50} />
                </IconButton>
            </div>
            {children}
        </Drawer>
    </div>
  );
})

export default SlideDrawer;