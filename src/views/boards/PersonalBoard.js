import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Fence from '../../component/personal/Fence';
import Land from '../../component/personal/Land';
import Empty from '../../component/personal/Empty';

export default function PersonalBoard2({ pid, currentPlayer, clickedPlayer }) {
  const [fencePosition, setFencePosition] = useState(Array(39).fill(false));
  
  const isFenceActive = (index) => {
    return fencePosition && fencePosition.length > index ? fencePosition[index] : false;
  };

  const handleCardClick = (index) => {
    setFencePosition((prev) => {
      const newFencePosition = [...prev];
      newFencePosition[index] = true; // Set the clicked fence to active
      return newFencePosition;
    });

    console.log(`${currentPlayer}번 플레이어가 울타리 ${index + 1}번을 클릭했습니다.`);
  };

  const renderFence = (ratio, isVertical, index) => (
    <Fence
      currentPlayer={currentPlayer}
      clickedPlayer={clickedPlayer}
      ratio={ratio}
      isVertical={isVertical}
      isActive={isFenceActive(index)}
      pid={pid}
      onClick={() => handleCardClick(index)}
    />
  );

  const renderLand = (index, state = "") => (
    <Land
      pid={pid}
      state={state}
      isActive={true}
      currentPlayer={currentPlayer}
      clickedPlayer={clickedPlayer}
    />
  );

  const handleMessageReceived = (message) => {
    // Handle incoming messages
    console.log('Received message:', message);
  };

  return (
    <Box
      height={420}
      width={700}
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      gap={1}
      p={2}
      sx={{ m: 0 }}
    >
      <Empty />
      {renderFence(1, false, 1)}
      <Empty />
      {renderFence(2, false, 2)}
      <Empty />
      {renderFence(3, false, 3)}
      <Empty />
      {renderFence(4, false, 4)}
      <Empty />
      {renderFence(5, false, 5)}
      <Empty />

      <Empty />
      {renderFence(6, true, 6)}
      {renderLand(1, "wood_room")}
      {renderFence(7, true, 7)}
      {renderLand(2, "soil_room")}
      {renderFence(8, true, 8)}
      {renderLand(3, "rock_room")}
      {renderFence(9, true, 9)}
      {renderLand(4, "plow")}
      {renderFence(10, true, 10)}
      {renderLand(5, "plow_grain1")}
      {renderFence(11, true, 11)}
      <Empty />

      <Empty />
      {renderFence(12, false, 12)}
      <Empty />
      {renderFence(13, false, 13)}
      <Empty />
      {renderFence(14, false, 14)}
      <Empty />
      {renderFence(15, false, 15)}
      <Empty />
      {renderFence(16, false, 16)}
      <Empty />
      
      <Empty />
      {renderFence(17, true, 17)}
      {renderLand(6)}
      {renderFence(18, true, 18)}
      {renderLand(7)}
      {renderFence(19, true, 19)}
      {renderLand(8)}
      {renderFence(20, true, 20)}
      {renderLand(9)}
      {renderFence(21, true, 21)}
      {renderLand(10)}
      {renderFence(22, true, 22)}
      <Empty />

      <Empty />
      {renderFence(23, false, 23)}
      <Empty />
      {renderFence(24, false, 24)}
      <Empty />
      {renderFence(25, false, 25)}
      <Empty />
      {renderFence(26, false, 26)}
      <Empty />
      {renderFence(27, false, 27)}
      <Empty />

      <Empty />
      {renderFence(28, true, 28)}
      {renderLand(11)}
      {renderFence(29, true, 29)}
      {renderLand(12)}
      {renderFence(30, true, 30)}
      {renderLand(13)}
      {renderFence(31, true, 31)}
      {renderLand(14)}
      {renderFence(32, true, 32)}
      {renderLand(15)}
      {renderFence(33, true, 33)}
      <Empty />
      
      <Empty />
      {renderFence(34, false, 34)}
      <Empty />
      {renderFence(35, false, 35)}
      <Empty />
      {renderFence(36, false, 36)}
      <Empty />
      {renderFence(37, false, 37)}
      <Empty />
      {renderFence(38, false, 38)}
      <Empty />
    </Box>
  );
}
