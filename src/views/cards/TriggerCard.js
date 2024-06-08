import React, { useState, useEffect } from 'react';

// MUI 컴포넌트
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
// import Tooltip from '@mui/material/Tooltip';

// import { minorCardDetails } from '../../components/details/MinorCardDeatails';
// import { workCardDetails } from '../../components/details/WorkCardDeatails';
// import { majorCardDetails } from '../../components/details/MajorCardDeatails';

const TriggerCard = ({ cardType, cardNumber, onClick }) => {

  // 카드 클릭 시 호출되는 핸들러 함수 
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(cardType, cardNumber);
    }
  };

  const [imagePath, setImagePath] = useState('');
  // const [details, setDetails] = useState([]);

  useEffect(() => {
    if (cardType === 'work') {
      setImagePath(`../image/WorkCard/work${cardNumber}.png`);
      // setDetails(workCardDetails);
    } else if (cardType === 'minor') {
      setImagePath(`../image/MinorCard/minor${cardNumber}.png`);
      // setDetails(minorCardDetails);
    } else if (cardType === 'major') {
      setImagePath(`../image/MajorCard/major${cardNumber}.png`);
      // setDetails(majorCardDetails);
    }
  }, [cardType, cardNumber]);

  const cardClass = `${cardType} ${cardNumber}`;

  return (
    // <Tooltip title={details[cardNumber - 1]}>
      <Card sx={{ maxWidth: 130, borderRadius: 1  }}>
        <CardActionArea onClick={handleClick}>
          <CardMedia
            component="img"
            image={imagePath}
            alt={cardClass}
          />
        </CardActionArea>
      </Card>
    // </Tooltip>
  );
};

export default TriggerCard;
