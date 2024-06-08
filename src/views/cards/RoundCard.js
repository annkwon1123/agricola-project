import React, { useState } from 'react';

// MUI 불러오기
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';

export default function RoundCard({ cardNumber, playerNumber, onClick, isBack }) {

  // 카드가 클릭된 상태
  const [isClicked, setIsClicked] = useState(playerNumber !== null && playerNumber !== 0);

  // 카드 클릭 시 호출되는 핸들러 함수 
  const handleClick = () => {
    if (isBack == false){
      isBack == !isBack
      setTimeout(() => {
        if (typeof onClick === 'function') {
          onClick(cardNumber);
        }
      }, 500); // 0.5초 후에 onClick 실행
    }
    if (isBack == true){
      setTimeout(() => {
        if (typeof onClick === 'function') {
          onClick(cardNumber);
        }
      }, 500); // 0.5초 후에 onClick 실행
    }
  };

  const cardClass = `card ${isBack ? 'front' : 'back' }`;
  const imagePath = isBack ? `../../image/RoundCard/round${cardNumber}.png` : `../../image/CardFrame/frame1.png`;
  const coverImagePath = playerNumber ? `../../image/ClickedCard/clicked-round${playerNumber}.png` : null;

  // 카드 컴포넌트 반환
  return (
    <div>
      <Card 
        sx={{
          maxWidth: 130,
          borderRadius: 1,
          transform: isBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.5s', borderRadius: '10px'
        }}
        >
        <CardActionArea onClick={handleClick}>
            <CardMedia
              component="img"
              height="200"
              image={imagePath}
              alt={cardClass}
            />
            {isBack == 1 && isClicked && coverImagePath && (
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
        </CardActionArea>
      </Card>
    </div>
  );
};

