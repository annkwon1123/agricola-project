import React, { useState, useRef } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import ActionCard from '../cards/ActionCard';

// 컨텍스트 불러오기
import { useCardId, useCardType } from '../../component/Context';
import { usePlayerPostions } from '../../component/ReceiveContext';

export default function ActionBoard({ currentPlayer, onClick, clickedActionCards, resourceActionCards }) {

  const { cardId, setCardId } = useCardId();
  const { cardType, setCardType } = useCardType();
  // const { clickedActionCards } = usePlayerPostions();

  const handleCardClick = (cardNumber) => {
    console.log(`${currentPlayer}번 플레이어가 행동카드 ${cardNumber}번을 클릭했습니다.`);

    setCardId(cardNumber);
    setCardType('action');
    
    if (typeof onClick === 'function') {
      onClick(cardNumber, currentPlayer);
    }
  };

  return (
    <Box
      height={420}
      width={700}
      display="flex"
      alignItems="center"
      gap={4}
      p={2}
      sx={{ m: 0 }}
    >
      
      <Grid container spacing={{ xs: 2, md: 3 }} columns={5}>
        {clickedActionCards.map((playerNumber, index) => (
          <Grid item xs={3} sm={1} md={1} key={index}>
            <ActionCard
              cardNumber={index + 1}
              playerNumber={playerNumber}
              onClick={() => handleCardClick(index + 1)}
              resource={resourceActionCards[index + 1]}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
