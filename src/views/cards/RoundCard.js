import React, { useState } from 'react';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography'; 

import { useCardId, useCardType } from '../../component/Context';
import DialogChoiceCard from '../cards/DialogChoiceCard';

export default function RoundCard({ playerNumber, cardNumber, resource, onClick, isBack }) {

  const { cardId, setCardId } = useCardId();
  const { cardType, setCardType } = useCardType();

  // 카드가 클릭된 상태
  const [isClicked, setIsClicked] = useState(playerNumber !== null);

  // 카드 클릭 시 호출되는 핸들러 함수 
  const handleClick = () => {
    if (!isBack && typeof onClick === 'function') {
      onClick(cardNumber);
    }

    setCardId(cardNumber);
    setCardType('round');

    if(cardNumber == 1 || cardNumber == 4 || cardNumber == 5 || cardNumber == 6) {
      setOpen(true); 
    } 
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => { setOpen(false); };

  const cardClass = `round ${cardNumber} ${isClicked ? 'Y' : 'N'} ${isBack ? 'back' : 'front'}`;
  const imagePath = isBack ? `../../image/CardFrame/frame1.png` : `../../image/RoundCard/round${cardNumber}.png`;
  const coverImagePath = playerNumber ? `../../image/ClickedCard/clicked-round${playerNumber}.png` : null;

  return (
    <div>
      {!isBack && (
        <DialogChoiceCard
          cardType={cardType}
          cardNumber={cardId}
          open={open}
          onClose={handleClose}
        />
      )}
      <Card sx={{ maxWidth: 130, borderRadius: 2.5 }} >
        <CardActionArea onClick={handleClick}>
          <CardMedia
            component="img"
            height="200"
            image={imagePath}
            alt={cardClass}
          />
          {!isBack && isClicked && coverImagePath && (
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
        </CardActionArea>
      </Card>
    </div>
  );
};

