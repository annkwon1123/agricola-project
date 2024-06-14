import React, { useState } from 'react';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';

import { useCardId, useCardType } from '../../component/Context';

function ChoiceCard({ playerNumber, cardNumber, index, onClick }) {

  const { cardId, setCardId } = useCardId();
  const { cardType, setCardType } = useCardType();

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(cardNumber);
    }

    setCardId(cardNumber);
    setCardType('choice');
  };

  const cardClass = `choice ${cardNumber}-${index}`;
  const imagePath = `../../image/ChoiceCard/choice${cardNumber}-${index}.png`;

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          image={imagePath}
          alt={cardClass}
        />
      </CardActionArea>
    </Card>
  );
}

export default ChoiceCard;
