import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import styles from "./styles/popup-box.module.css";

const PopupBox = ({ children, onClose, popupTitle }) => {

    return (
        <div className={styles.popupContainer}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar sx={{display: "flex", justifyContent: "space-between", paddingLeft: 0}}>
                <Typography edge="start" sx={{ ml: 2 }} variant="h6" component="div">
                    {popupTitle}
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                </Toolbar>
            </AppBar>
            {children}
        </div>
    )
}

export default PopupBox;