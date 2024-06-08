import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
// import Tooltip from '@mui/material/Tooltip';
// import { majorCardDetails } from '../../components/details/MajorCardDeatails';

const MajorCard = ({ cardNumber, onClick }) => {

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(cardNumber);
    }
  };
  
  const cardClass = `major ${cardNumber} `;
  const imagePath = `../../image/MajorCard/major${cardNumber}.png`;

  return (
    // <Tooltip title={majorCardDetails[cardNumber - 1]}>
      <Card sx={{ maxWidth: 130, borderRadius: 1 }}>
        <CardActionArea onClick={handleClick}>
          <CardMedia
            component="img"
            height="200"
            image={imagePath}
            alt={cardClass}
          />
        </CardActionArea>
      </Card>
    // </Tooltip>
  );
};

export default MajorCard;
