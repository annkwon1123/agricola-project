import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';

import TriggerCard from '../cards/TriggerCard';
import { useDeckCard1, useDeckCard2, useDeckCard3, useDeckCard4 } from '../../component/Context';
import { useCardId, useCardType } from '../../component/Context';

const TriggerBoard = ({ currentPlayer, clickedPlayer }) => {

  const { cardId, setCardId } = useCardId();
  const { cardType, setCardType } = useCardType();

  const { deckCard1 } = useDeckCard1();
  const { deckCard2 } = useDeckCard2();
  const { deckCard3 } = useDeckCard3();
  const { deckCard4 } = useDeckCard4();

  const [deckCard, setDeckCard] = useState([]);
  const [color, setColor] = useState('');

  useEffect(() => {
    if (clickedPlayer === 1) {
      setColor("#66CC66");
      setDeckCard(deckCard1);
    } else if (clickedPlayer === 2) {
      setColor("#CC3333");
      setDeckCard(deckCard2);
    } else if (clickedPlayer === 3) {
      setColor("#3366CC");
      setDeckCard(deckCard3);
    } else {
      setColor("#FFFF99");
      setDeckCard(deckCard4);
    }
  }, [clickedPlayer, deckCard1, deckCard2, deckCard3, deckCard4]);

  const handleCardClick = ({ cardType, cardNumber }) => {
    console.log(`${currentPlayer}번 플레이어가 ${cardType}카드 ${cardNumber}번을 클릭했습니다.`);

    setCardId(cardNumber);
    setCardType(cardType);
    
    if (typeof onClick === 'function') {
      onClick(cardNumber, currentPlayer);
    }
  };

  return (
    <Box
      height={200}
      width={550}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      backgroundColor={color}
      gap={4}
      p={2}
      sx={{
        my: 2,
        mx: 2,
        border: '1.5px solid #000000',
        borderRadius: 0.8,
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      {deckCard.map((item) => (
        <Box
          key={item.cardNumber}
          sx={{ flex: '0 0 auto', my: '90px' }}
          style={{ cursor: 'pointer' }}
        >
          <TriggerCard
            cardType={item.cardType}
            cardNumber={item.cardNumber}
            onClick={() => handleCardClick(item)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default TriggerBoard;
