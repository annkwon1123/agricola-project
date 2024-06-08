import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardMedia from '@mui/material/CardMedia'
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { usePlayer } from '../../component/Context';

const settings = ['PersonalBoard'];

// 선 표시(뱃지)
const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    backgroundImage: `url("../../image/Profile/playerFirst.png")`, // 뱃지 이미지 경로 설정
    backgroundSize: 'cover',
    width: '40px', // 뱃지 이미지의 가로 크기에 맞게 조정
    height: '40px', // 뱃지 이미지의 세로 크기에 맞게 조정
    '&::after': {
      display: 'none', // 이미지에서 사용하지 않는 요소 숨기기
    },
  },
}));

const ProfileCard = ({ playerNumber, isFirstPlayer }) => {
  const { clickedPlayer, setClickedPlayer } = usePlayer();

  // 카드 클릭 시 호출되는 핸들러 함수
  const handleClick = () => {
    setClickedPlayer(playerNumber);
    if (typeof onClick === 'function') {
      onClick(playerNumber);
    }
  };

  const cardClass = `profile ${playerNumber} `;
  const imagePath = `../image/ClickedCard/clicked-action${playerNumber}.png`;

  return (
    // 테두리 박스 설정 
    <div>
      {isFirstPlayer ? (
        <Grid marginY={2}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Card sx={{ borderRadius: 2 }}>
              <CardActionArea onClick={handleClick}>
                <CardMedia
                  component="img"
                  image={imagePath}
                  alt={cardClass}
                />
              </CardActionArea>
            </Card>
          </StyledBadge>
        </Grid>
      ) : (
        <Grid marginY={2}>
          <Card sx={{ borderRadius: 2 }}>
            <CardActionArea onClick={handleClick}>
              <CardMedia
                component="img"
                image={imagePath}
                alt={cardClass}
              />
            </CardActionArea>
          </Card>
        </Grid>
      )}
    </div>
  );
};

export default ProfileCard;
