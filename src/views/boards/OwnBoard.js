import React, { useState } from 'react';
import Box from '@mui/material/Box';

import OwnCard from '../cards/OwnCard';

// 컨텍스트 불러오기
import { useDeckCard1, useDeckCard2, useDeckCard3, useDeckCard4 } from '../../component/Context';
import { useCardId, useCardType } from '../../component/Context';

const OwnBoard = ({ currentPlayer }) => {

  const { cardId, setCardId } = useCardId();
  const { cardType, setCardType } = useCardType();

  const { setDeckCard1 } = useDeckCard1();
  const { setDeckCard2 } = useDeckCard2();
  const { setDeckCard3 } = useDeckCard3();
  const { setDeckCard4 } = useDeckCard4();

  // useEffect 훅을 사용하여 currentPlayer 값이 변경될 때 업데이트
  const setDeckCard = (deckCard) => {
    if (currentPlayer === 1) {
      setDeckCard1(deckCard);
    } else if (currentPlayer === 2) {
      setDeckCard2(deckCard);
    } else if (currentPlayer === 3) {
      setDeckCard3(deckCard);
    } else {
      setDeckCard4(deckCard);
    }
  }

  const initialOwnCards = [
    { cardNumber: 1, cardType: 'work' },
    { cardNumber: 2, cardType: 'work' },
    { cardNumber: 3, cardType: 'work' },
    { cardNumber: 4, cardType: 'minor' },
    { cardNumber: 5, cardType: 'minor' },
    { cardNumber: 6, cardType: 'minor' },
  ];
  
  const [ownCards, setOwnCards] = useState(initialOwnCards); // 상태와 상태 설정 함수를 반환

  const handleOwnCardClick = ({ cardType, cardNumber }) => {
    setOwnCards((prevList) => prevList.filter((item) => item.cardNumber !== cardNumber));
    
    const clickedCard = ownCards.find((item) => item.cardNumber === cardNumber);
    
    if (clickedCard) {
      setDeckCard((prevList) => [...prevList, clickedCard]);
    }

    console.log(`${currentPlayer}번 플레이어가 ${cardType}카드 ${cardNumber}번을 클릭했습니다.`);

    setCardId(cardNumber);
    setCardType(cardType);
    
    if (typeof onClick === 'function') {
      onClick(cardNumber, currentPlayer);
    }
  };

  return (
    <Box
      height={150}
      width={550}
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      gap={2}
      p={2}
      sx={{
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none',
        // backgroundColor: '#87C748',
        // borderRadius: 3
      }}
    >
      {ownCards.map((item) => {
        return (
          <Box 
            key={item.cardNumber} 
            sx={{ flex: '0 0 auto', mr: '-30px', my: '90px'}}
            onClick={() => handleOwnCardClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <OwnCard
              cardType={item.cardType}
              cardNumber={item.cardNumber}
            />
          </Box>
        );
      })} 
    </Box>
  );
};

export default OwnBoard;
