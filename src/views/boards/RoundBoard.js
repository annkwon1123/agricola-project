import React, { useState, useRef  } from 'react';

// MUI 불러오기
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import RoundCard from '../cards/RoundCard'

// 컨텍스트 불러오기
import { useCardId, useCardType } from '../../component/Context';

export default function RoundBoard({ currentPlayer, onClick, clickedRoundCards, resourceRoundCards, isBackRoundCards }) {
  
  const { cardId, setCardId } = useCardId();
  const { cardType, setCardType } = useCardType();

  const handleCardClick = (cardNumber) => {
    console.log(`${currentPlayer}번 플레이어가 라운드카드 ${cardNumber}번을 클릭했습니다.`);

    setCardId(cardNumber);
    setCardType('round');
    
    if (typeof onClick === 'function') {
      onClick(cardNumber, currentPlayer);
    }
  };

  return (
    <Box
      height={420}
      width={590}
      display="flex"
      justifyContent="center"
      gap={4}
      p={2}
      sx={{ m: 0 }}
    >
      <Grid container direction="column" justifyContent="center" alignItems="flex-start" spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 8 }}>
        {clickedRoundCards.slice(0, 4).map((playerNumber, index) => (
          <Grid item xs={1} sm={1} md={1} key={index}>
            <RoundCard 
              cardNumber={index + 1} 
              playerNumber={playerNumber}
              onClick={() => handleCardClick(index + 1)}
              resource={resourceRoundCards[index]}
              isBack={isBackRoundCards[index]}
            />
          </Grid>
        ))}
        {clickedRoundCards.slice(4, 6).map((playerNumber, index) => (
          <Grid item xs={2} sm={2} md={8} key={index}>
            <RoundCard  
              cardNumber={index + 5} 
              playerNumber={playerNumber} 
              onClick={() => handleCardClick(index + 5)}
              isBack={isBackRoundCards[index + 4]}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
