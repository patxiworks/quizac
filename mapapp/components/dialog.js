import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

function ConfirmationDialogMaps(props) {
  const { onClose, onCancel, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleOkay = () => {
    onClose();
  };

  const handleCancel = () => {
    onCancel();
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>{props.title}</DialogTitle>
      <DialogContent dividers>
        {props.content}
      </DialogContent>
      <DialogActions>
        {props.cancel ? <Button onClick={handleCancel}>Cancel</Button> : ''}
        <Button autoFocus onClick={handleOkay}>
          {props.prompt}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogMaps.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  //value: PropTypes.string.isRequired,
};

export {
    ConfirmationDialogMaps
}