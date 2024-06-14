import React, { useState, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import ChoiceCard from './ChoiceCard';

function DialogChoiceCard(props) {
  const { cardNumber, choiceType, options, open, onClose, currentPlayer } = props;

  const [cardName, setCardName] = useState('');
  const [count, setCount] = useState([]);

  const handleCardClick = (index) => {
    console.log(`${currentPlayer}번 플레이어가 추가선택카드 ${cardNumber}-${index}번을 클릭했습니다.`);

    onClose();
  };

  useEffect(() => {
    if (cardNumber === 7) {
      setCardName('농장 확장');
      setCount([1, 2, 3]);
    } else if (cardNumber === 8) {
      setCardName('회합 장소');
      setCount([1, 2, 3]);
    } else if (cardNumber === 1) {
      setCardName('곡식 활용');
      setCount([1, 2, 3]);
    } else if (cardNumber === 4) {
      setCardName('주요 설비');
      setCount([1, 2]);
    } else if (cardNumber === 5) {
      setCardName('기본 가족 늘리기');
      setCount([1, 2]);
    } else if (cardNumber === 6) {
      setCardName('농장 개조');
      setCount([1, 2]);
    }
  }, [cardNumber]);

  return (
    <Dialog open={open}>
      <DialogTitle>{cardName}</DialogTitle>
      <Box
        mx={2}
        my={2}
        display="flex"
        alignItems="center"
        gap={4}
        p={2}
      >
        {count.map((index) => (
          <ChoiceCard
            key={index}
            cardNumber={cardNumber}
            index={index}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </Box>
    </Dialog>
  );
}

export default DialogChoiceCard;
