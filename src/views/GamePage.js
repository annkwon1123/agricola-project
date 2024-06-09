import React, { useEffect, useState, useRef } from 'react';

// 백엔드 통신부
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// MUI 불러오기
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

// 보드판 불러오기
import ProfileCard from "./cards/ProfileCard";
import ActionBoard from './boards/ActionBoard';
import RoundBoard from './boards/RoundBoard';
import CurrentBoard from './boards/CurrentBoard';
import ResourceBoard from './boards/ResourceBoard';
import PersonalBoard from './boards/PersonalBoard';
import OwnBoard from './boards/OwnBoard';
import TriggerBoard from './boards/TriggerBoard';
import MajorPopUp from './MajorPopUp';
import DialogChoiceCard from './cards/DialogChoiceCard';

// 컨텍스트 불러오기
import { useCardId, useCardType, usePlayer } from '../component/Context';
import { usePlayerList, usePlayerId } from '../component/Context';
import { usePlayerPostions } from '../component/ReceiveContext';

function GamePage({ currentPlayer }) {

  const [stompClient, setStompClient] = useState(null);
  const [gameState, setGameState] = useState('');

  const { clickedPlayer, setClickedPlayer } = usePlayer(); // 프로필을 클릭한 사람
  const { cardId, setCardId } = useCardId();
  const { cardType, setCardType } = useCardType();
  
  const { playerList, setPlayerList } = usePlayerList();
  const { playerId, setPlayerId} = usePlayerId();


    // 플레이어 리스트 초기화
    useEffect(() => {
      setPlayerList([
        { id: '1', name: 'Player 1' },
        { id: '2', name: 'Player 2' },
        { id: '3', name: 'Player 3' },
        { id: '4', name: 'Player 4' }
      ]);
  
    }, [setPlayerList]);

  const [currentPlayerID, setCurrentPlayerID] = useState(null);
  const [exchangeableCards, setExchangeableCards] = useState([]);
  const gameID = '1234'; // Example game ID
  
  useEffect(() => {
    connect();
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  const connect = () => {
    const socket = new SockJS('http://localhost:8091/agricola-service');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        client.subscribe('/topic/game', (message) => {
          console.log('Received message: ' + message.body);
          handleGameState(JSON.parse(message.body));
        });

        client.subscribe(`/topic/room/1`, (message) => {
          console.log('Received card options: ' + message.body);
          handleGameState2(JSON.parse(message.body));
        });

        setStompClient(client);
      },
    });

    client.activate();
  };

  // 초기화 정보 보내는 함수
  const startGame = () => {
    if (stompClient) {
      const payload = {
        roomNumber: gameID,
        players: playerList
      };
      console.log('Sending startGame message with payload:', payload);
      stompClient.publish({ destination: '/app/room/1/start', body: JSON.stringify(payload) });
    } else {
      console.error('stompClient is not initialized');
    }
  };

  // 선택한 카드 정보 보내는 함수
  const selectCard = (cardId) => {
    if (stompClient) {
      const payload = { currentPlayer: currentPlayer, cardNumber: cardId };
      console.log('Selecting card with ID:', cardId);
      stompClient.publish({ destination: '/app/room/1/actionCardClick', body: JSON.stringify(payload) });
    } else {
      console.error('stompClient is not initialized');
    }
  };

  // 현재 차례인 플레이어와 가능한 액션 카드 칸 정보 받아오는 함수
  const handleGameState = (message) => {
    if (message.playerId) {
      console.log('현재 차례인 플레이어 정보', message.playerId);
      setPlayerId(message.playerId);
    }
    if (message.availableCards) {
      console.log('가능한 액션 카드 칸', message.availableCards);
    }
  };

  // 클릭된 액션 카드 칸 정보 받아오는 함수
  const handleGameState2 = (message) => {
    if (message.playerPositions) {
      console.log('플레이어 포지션', message.playerPositions);
      setClickedActionCards(message.playerPositions.slice(0, 14));
      setClickedRoundCards(message.playerPositions.slice(14));
      console.log('액션 보드 플레이어 포지션', clickedActionCards);
      console.log('라운드 보드 플레이어 포지션', clickedRoundCards);
    }
  };

  // ** 액션 카드 / 보드
  // 0: 사람없음, 1~4: 플레이어 -> 14개 카드
  const initialClickedActionCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const [clickedActionCards, setClickedActionCards] = useState(initialClickedActionCards);
  
  // 자원누적이 필요한 카드: 1,2,4,6,11,12,13 번
  const initialResourceActionCards = [,2,1,,1,,1,,,,,1,1,1,,];
  const [resourceActionCards, setResourceActionCards] = useState(initialResourceActionCards);

  // 액션 카드 클릭시 
  const handleActionCardClick = (cardNumber) => {
    selectCard(cardNumber);
    const newClickedActionCards = [...clickedActionCards];
    newClickedActionCards[cardNumber - 1] = currentPlayer;
    setClickedActionCards(newClickedActionCards);
  };

  // ** 라운드 카드 / 보드
  // 0: 사람없음, 1~4: 플레이어 -> 6개 카드
  const initialClickedRoundCards = [2, 1, 3, 4, 0, 0];
  const [clickedRoundCards, setClickedRoundCards] = useState(initialClickedRoundCards);
  
  // 자원누적이 필요한 카드: 3 번
  const initialResourceRoundCards = [,,,1,,,];
  const [resourceRoundCards, setResourceRoundCards] = useState(initialResourceRoundCards);

  // 뒷면이면 0, 앞면이면 1
  const initialIsBackRoundCards = [1, 1, 1, 1, 1, 0];
  const [isBackRoundCards, setIsBackRoundCards] = useState(initialIsBackRoundCards);

  // 라운드 카드 클릭시
  const handleRoundCardClick = (cardNumber) => {
    selectCard(cardNumber);
    const newClickedRoundCards = [...clickedRoundCards];
    newClickedRoundCards[cardNumber - 1] = currentPlayer;
    setClickedRoundCards(newClickedRoundCards);
  };

  // ** 주요 설비 카드 / 보드
  // 주요 설비 카드 팝업창 관리
  const [open, setOpen] = React.useState(false);
  const handleClick = () => { setOpen(true); }; 
  const handleClose = () => { setOpen(false); };

  return (
      <Grid 
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        >
           <button id="startGameButton" onClick={startGame}>Start Game</button>
           <button onClick={handleClick}>
            ChoiceCard
            <DialogChoiceCard
                cardNumber={cardId}
                choiceType={"AndOr"}
                open={open}
                onClose={handleClose}
                currentPlayer={currentPlayer}
            />
            </button>
           <pre>{JSON.stringify(clickedActionCards, null, 2)}</pre>
        <Box
          height={1010}
          width={120}
          sx={{
            backgroundImage: 'url("/image/background.png")',
            backgroundRepeat: "repeat",
            border: "3.3px solid #7B5B3C",
            borderRadius: 2,
            p: 2,
            my: 1,
            mx: 2
          }}
        >
          <Grid container spacing={1}>
            <Typography>플레이어 프로필 클릭시 개인보드와 자원보드가 변경됩니다.</Typography>
            <ProfileCard playerNumber={1}  isFirstPlayer={true}/>
            <Typography>고도희</Typography>
            <ProfileCard playerNumber={2}  isFirstPlayer={false}/>
            <Typography>정지윤</Typography>
            <ProfileCard playerNumber={3}  isFirstPlayer={false}/>
            <Typography>김윤재</Typography>
            <ProfileCard playerNumber={4}  isFirstPlayer={false}/>
            <Typography>이수빈</Typography>

            <MajorPopUp currentPlayer={currentPlayer} />
          </Grid>
        </Box>
        <Grid>
        <Box
          sx={{
            backgroundImage: 'url("/image/background.png")',
            backgroundRepeat: "repeat",
            border: "3.3px solid #7B5B3C",
            borderRadius: 2,
            p: 2,
            my: 1,
          }}
        >
          <Grid container spacing={1}>
            <CurrentBoard currentPlayer={currentPlayer} turnPlayer={playerId}/>
          </Grid>
        </Box>
        <Box
          sx={{
            backgroundImage: 'url("/image/background.png")',
            backgroundRepeat: "repeat",
            border: "3.3px solid #7B5B3C",
            borderRadius: 2,
            p: 2,
            my: 1,
          }}
        >
        <Grid container spacing={1} >
          <ActionBoard 
            currentPlayer={currentPlayer} 
            onClick={(cardNumber) => handleActionCardClick(cardNumber)}
            clickedActionCards={clickedActionCards}
            resourceActionCards={resourceActionCards}
            
          />
          <RoundBoard 
            currentPlayer={currentPlayer} 
            onClick={(cardNumber) => handleRoundCardClick(cardNumber)}
            clickedRoundCards={clickedRoundCards}
            resourceRoundCards={resourceRoundCards}
            isBackRoundCards={isBackRoundCards}
          />
        </Grid>

        <Grid container spacing={1} >
          <PersonalBoard currentPlayer={currentPlayer} clickedPlayer={clickedPlayer} />
          <Grid> 
            <TriggerBoard currentPlayer={currentPlayer} clickedPlayer={clickedPlayer} />
            <OwnBoard currentPlayer={currentPlayer} />
          </Grid>
        </Grid>
      {cardId} {cardType} card
        </Box>
        </Grid>
         <Grid>
            <ResourceBoard playerNumber={1} />
            <ResourceBoard playerNumber={2} />
            <ResourceBoard playerNumber={3} />
            <ResourceBoard playerNumber={4} />
          </Grid>
      </Grid>
  );
}

export default GamePage;
