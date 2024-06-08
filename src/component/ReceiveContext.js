import React, { createContext, useContext, useState } from 'react';

// 컨텍스트 생성
const ReceiveContext = createContext();

// 컨텍스트 제공자 컴포넌트
export const ReceiveComponentProvider = ({ children }) => {

  // 액션보드
  const [playerPositions, setPlayerPositions] = useState([]);

  return (
    <ReceiveContext.Provider 
    value={{ 
      playerPositions, setPlayerPositions,
    }}>
      {children}
    </ReceiveContext.Provider>
  );
};


// 커스텀 훅

export const usePlayerPostions = () => {
  const context = useContext(ReceiveContext);
  if (!context) {
    throw new Error('playerPositions must be used within a Provider');
  }
  return { playerPositions: context.playerPositions, setPlayerPositions: context.setPlayerPositions };
};