import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';

export default function Fence({ ratio, currentPlayer, isVertical, isActive, onClick, clickedPlayer }) {
  const width = isVertical ? '14px' : '104px';
  const height = isVertical ? '104px' : '14px';

  const [color, setColor] = useState('');

  // useEffect 훅을 사용하여 clickedPlayer 값이 변경될 때만 색상을 업데이트
  useEffect(() => {
    if (clickedPlayer === 1) {
      setColor("#66CC66");
    } else if (clickedPlayer === 2) {
      setColor("#CC3333");
    } else if (clickedPlayer === 3) {
      setColor("#3366CC");
    } else {
      setColor("#FFFF99");
    }
  }, [clickedPlayer]);

  const handleClick = () => {
    console.log(ratio);
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card>
      <CardActionArea sx={{
        width: width,
        height: height,
        backgroundColor: color,
        borderRadius: '4px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'black',
        opacity: isActive ? 1 : 0.1,
        m: 0,
      }}
      onClick={handleClick} />
    </Card>
  );
}
