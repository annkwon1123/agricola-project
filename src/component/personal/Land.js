import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';

export default function Land({ currentPlayer, clickedPlayer, landNumber, state, onClick, isActive, data }) {

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
    console.log(landNumber);
    if (onClick) {
      onClick();
    }
  };

  const ImagePath = state ? `../../image/Farm/${state}.png` : null;

  return (
    <Card>
      <CardActionArea sx={{
        width: '100px',
        height: '100px',
        backgroundColor: color,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        borderRadius: '4px', // border radius 설정
        borderWidth: '1px', // border width 설정
        borderStyle: 'solid', // border style 설정
        borderColor: 'black', // border color 설정
        opacity: isActive ? 1 : 0.1, // isActive 값에 따라 투명도 설정
        m: 0
      }}
        onClick={handleClick} >
        {state && ImagePath && (
          <img
            src={ImagePath}
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
      </CardActionArea>
    </Card>
  );
}
