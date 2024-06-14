import React, { useState } from 'react';

// MUI 불러오기
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import RoundCard from '../cards/RoundCard'

export default function RoundBoard({ currentPlayer, onClick }) {

  // ** 라운드 카드 / 보드
  // 0: 사람없음, 1~4: 플레이어 -> 6개 카드
  const initialClickedRoundCards = [2, 1, 3, 4, 0, 0];
  const [clickedRoundCards, setClickedRoundCards] = useState(initialClickedRoundCards);
  
  // 자원누적이 필요한 카드: 3 번
  const initialResourceRoundCards = [,,,1,,,];
  const [resourceRoundCards, setResourceRoundCards] = useState(initialResourceRoundCards);

  // 앞면이면 0, 뒷면이면 1
  const initialIsBackRoundCards = [0,0,0,0,0,1];
  const [isBackRoundCards, setIsBackRoundCards] = useState(initialIsBackRoundCards);

  const handleCardClick = (cardNumber) => {
    console.log(`${currentPlayer}번 플레이어가 라운드카드 ${cardNumber}번을 클릭했습니다.`);

    if (typeof onClick === 'function') {
      onClick(cardNumber, currentPlayer);
    }

    const newClickedRoundCards = [...clickedRoundCards];
    newClickedRoundCards[cardNumber - 1] = currentPlayer;
    setClickedRoundCards(newClickedRoundCards);
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
