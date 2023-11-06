import { useState } from 'react';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CategoryItem from "./category-item";
import styles from "./styles/popup-box.module.css";

import SearchIcon from '@mui/icons-material/Search';
import { Box, TextField, Typography, Menu, MenuItem, Autocomplete, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";

const FilterField = styled(TextField)({
    '& label': {
        color: '#fff',
        fontWeight: 'normal',
    },
    '& label:hover': {
        color: '#ccc'
    },
    '& label.Mui-focused': {
      color: '#679cd1',
    },
    '& .MuiInputBase-formControl': {
        color: '#fff'
    },
    '& .MuiInput-underline:hover': {
        borderBottomColor: '#FFF',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#FFF',
        borderBottomWidth: 2,
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: '#1a76d2',
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomColor: `#1a76d2 !important`,
      },
  });

const PopupBox = ({ children, onClose, popupTitle, items, data, getFilter }) => {
    const [open, setOpen] = useState(false);
    const sets = []

    return (
        <div className={styles.popupContainer}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar sx={{display: "flex", justifyContent: "space-between", paddingLeft: 2}}>
                    <Typography edge="start" sx={{ ml:0, width:'100%' }} variant="h6" component="div">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0 }}>
                            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5, color: '#fff' }} />
                            <FilterField id="input-with-sx" label={popupTitle} variant="standard" sx={{ width: 300 }} onChange={(e)=>getFilter(e.target.value)} />
                        </Box>
                    </Typography>
                </Toolbar>
            </AppBar>
            {children}
        </div>
    )
}

export default PopupBox;