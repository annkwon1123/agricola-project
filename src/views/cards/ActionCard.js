import React, { useState } from 'react';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography'; 

import { useCardId, useCardType } from '../../component/Context';
import DialogChoiceCard from '../cards/DialogChoiceCard';

export default function ActionCard({ playerNumber, cardNumber, resource, onClick }) {
  
  const { cardId, setCardId } = useCardId();
  const { cardType, setCardType } = useCardType();

  // 카드가 클릭된 상태
  const [isClicked, setIsClicked] = useState(playerNumber !== null);

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(cardNumber);
    }

    setCardId(cardNumber);
    setCardType('action');

    if(cardNumber == 7 || cardNumber == 8) {
      setOpen(true); 
    } 
  };

  const handleCardHover = (event) => {
    const card = event.currentTarget;
    card.style.transform = 'scale(1.1)';
    card.style.transition = 'transform 0.1s linear';
    card.style.boxShadow = '1px 4px 15px -3px rgba(0, 0, 0, 0.5)';
  };

  const handleCardLeave = (event) => {
    const card = event.currentTarget;
    card.style.transform = 'scale(1)';
    card.style.transition = 'transform 0.1s linear';
    card.style.boxShadow = 'none';
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => { setOpen(false); };

  const cardClass = `action ${cardNumber} ${isClicked ? 'Y' : 'N'} `;
  const imagePath = `../../image/ActionCard/action${cardNumber}.png`;
  const coverImagePath = playerNumber ? `../../image/ClickedCard/clicked-action${playerNumber}.png` : null;

  return (
    <div>
      <DialogChoiceCard
        cardType={cardType}
        cardNumber={cardId}
        open={open}
        onClose={handleClose}
      />
      <Card
        sx={{ maxWidth: 130, borderRadius: 2 }}
        onMouseEnter={handleCardHover}
        onMouseLeave={handleCardLeave}
      >
        <CardActionArea onClick={handleClick}>
          <div style={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image={imagePath}
              alt={cardClass}
            />
            {isClicked && coverImagePath && (
              <img
                src={coverImagePath}
                alt="coverImage"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
            <Typography
              variant="h4"
              color="text.primary"
              style={{ position: 'absolute', bottom: 18, right: 75, fontWeight: 'bold' }}
            >
              {resource}
            </Typography>
          </div>
        </CardActionArea>
      </Card>
    </div>
  );
}