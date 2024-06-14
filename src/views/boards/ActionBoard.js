import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import ActionCard from '../cards/ActionCard';


export default function ActionBoard({ currentPlayer, onClick }) {
  
  // ** 액션 카드 / 보드
  // 0: 사람없음, 1~4: 플레이어 -> 14개 카드
  const initialClickedActionCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const [clickedActionCards, setClickedActionCards] = useState(initialClickedActionCards);
  
  // 자원누적이 필요한 카드: 1,2,4,6,11,12,13 번
  const initialResourceActionCards = [,2,1,,1,,1,,,,,1,1,1,,];
  const [resourceActionCards, setResourceActionCards] = useState(initialResourceActionCards);

  const handleCardClick = (cardNumber) => {
    console.log(`${currentPlayer}번 플레이어가 행동카드 ${cardNumber}번을 클릭했습니다.`);
    
    if (typeof onClick === 'function') {
      onClick(cardNumber, currentPlayer);
    }

    const newClickedActionCards = [...clickedActionCards];
    newClickedActionCards[cardNumber - 1] = currentPlayer;
    setClickedActionCards(newClickedActionCards);
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
