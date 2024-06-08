import React, { useState } from 'react';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';

function ChoiceCard({ cardNumber, index, onClick, sendMessage }) {

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(cardNumber);
    }
    if (typeof sendMessage === 'function') {
      // `ChoiceCard: cardType ${cardType}, cardNumber ${cardNumber}, index ${index}`
      sendMessage(cardNumber);
    }
  };

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          image={`../../image/ChoiceCard/choice${cardNumber}-${index}.png`}
          alt={`ChoiceCard ${cardNumber}`}
        />
      </CardActionArea>
    </Card>
  );
}

export default ChoiceCard;
