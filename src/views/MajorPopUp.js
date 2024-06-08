import * as React from 'react';

import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'

import CardMedia from '@mui/material/CardMedia'
import Dialog from '@mui/material/Dialog';
import MajorBoard from './boards/MajorBoard'

function SimpleDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <MajorBoard />
    </Dialog>
  );
}

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const imagePath = '../../image/CardFrame/frame5.png'

  return (
    <div>
      <Card sx={{ borderRadius: 2, my: 3 }}>
        <CardActionArea onClick={handleClickOpen}>
          <CardMedia
            component="img"
            image={imagePath}
            onClick={handleClickOpen}
          />
        </CardActionArea>
      </Card>
      <SimpleDialog
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}