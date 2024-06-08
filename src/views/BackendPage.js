// pages/index.js

import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import styles from '../styles/Home.module.css'; // CSS 모듈 스타일

// 컨텍스트 불러오기
import { usePlayerList, useCardId, usePlayerId } from '../component/Context';
// import { useAnimalType, usePositions, usePos, useChoiceType, useChoice, useChosenResource, useTiming } from '../component/Context';

export default function Home() {

  const [stompClient, setStompClient] = useState(null);
  const [gameState, setGameState] = useState('');
  
  // 변수 선언
  const { playerList, setPlayerList } = usePlayerList();
  const { cardId, setCardId } = useCardId();
  const { playerId, setPlayerId} = usePlayerId();

  // 플레이어 리스트 초기화
  useEffect(() => {
    setPlayerList([
      { id: '1', name: 'Player 1' },
      { id: '2', name: 'Player 2' },
      { id: '3', name: 'Player 3' },
      { id: '4', name: 'Player 4' }
    ]);

    setPlayerId("2");
  }, [setPlayerList, setPlayerId]);

//   const { animalType, setAnimalType } = useAnimalType();
//   const { positions, setPositions } = usePositions();
//   const { pos, setPos } = usePos();
//   const { choiceType, setChoiceType } = useChoiceType();
//   const { choice, setChoice } = useChoice();
//   const { chosenResource, setchosenResource } = useChosenResource();
//   const { timing, setTiming } = useTiming();

  
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

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log('Received card options: ' + message.body);
          handleCardOptions(JSON.parse(message.body));
        });

        client.subscribe('/topic/validPositions', (message) => {
          console.log('Received valid positions: ' + message.body);
          handleValidPositions(JSON.parse(message.body));
        });

        client.subscribe('/topic/choiceRequest', (message) => {
          console.log('Received choice request: ' + message.body);
          handleChoiceRequest(JSON.parse(message.body));
        });

        client.subscribe('/topic/majorImprovementCards', (message) => {
          console.log('Received major improvement cards: ' + message.body);
          handleMajorImprovementCards(JSON.parse(message.body));
        });

        client.subscribe('/topic/playerResources', (message) => {
          console.log('Received player resources: ' + message.body);
          handlePlayerResources(JSON.parse(message.body));
        });

        client.subscribe('/topic/activeCards', (message) => {
          console.log('Received active cards: ' + message.body);
          handleActiveCards(JSON.parse(message.body));
        });

        client.subscribe('/topic/exchangeableCards', (message) => {
          console.log('Received exchangeable cards info: ' + message.body);
          handleExchangeableCards(JSON.parse(message.body));
        });

        setStompClient(client);
      },
    });

    client.activate();
  };

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

  const viewExchangeableCards = () => {
    if (stompClient && currentPlayerID !== null) {
      const payload = { playerId: currentPlayerID };
      console.log('Requesting exchangeable cards for player:', currentPlayerID);
      stompClient.publish({ destination: '/app/viewExchangeableCards', body: JSON.stringify(payload) });
    } else {
      console.error('stompClient is not initialized or currentPlayerID is null');
    }
  };

  const handleGameState = (gameState) => {
    if (gameState.message) {
      setGameState((prevState) => prevState + `<p>${gameState.message}</p>`);
    }

    if (gameState.currentRound) {
      const players = gameState.players.map(player => formatPlayer(player)).join('\n\n');
      const mainBoard = formatMainBoard(gameState.mainBoard);
      const gameInfo = `Game ID: ${gameState.gameID}\nCurrent Round: ${gameState.currentRound}`;

      setGameState((prevState) => prevState + `<div class="section-title">Game Info</div>\n${gameInfo}\n\n<div class="section-title">Players</div>\n${players}\n\n<div class="section-title">Main Board</div>\n${mainBoard}`);
    }

    if (gameState.playerId && gameState.availableCards) {
      setCurrentPlayerID(gameState.playerId);
      handlePlayerTurn(gameState.playerId, gameState.availableCards);
    }

    if (gameState.playerId && gameState.exchangeableCards) {
      handleExchangeableCards(gameState.playerId, gameState.exchangeableCards);
    }
  };

  const handlePlayerTurn = (playerId, availableCards) => {
    if (playerId === currentPlayerID) {
      let cardOptions = availableCards.map(card => `<button class="card-button" onClick={() => selectCard(${card.id})}>${card.name}</button>`).join('');
      setGameState((prevState) => prevState + `<div class="section-title">Your Turn</div>\n${cardOptions}`);
    }
  };

  const handleExchangeableCards = (playerId, exchangeableCards) => {
    if (playerId === currentPlayerID) {
      let cardOptions = exchangeableCards.map(card => `<button class="card-button" onClick={() => exchangeCard(${card.id})}>${card.name}</button>`).join('');
      setGameState((prevState) => prevState + `<div class="section-title">Exchangeable Cards</div>\n${cardOptions}`);
    }
  };

  const handleCardOptions = (cardOptions) => {
    let cardListHtml = cardOptions.map(card => `<button class="card-button" onClick={() => selectOccupationCard(${card.id})}>${card.name}</button>`).join('');
    setGameState((prevState) => prevState + `<div class="section-title">Select a Card</div>\n${cardListHtml}`);
  };

  const selectCard = (cardId) => {
    if (stompClient) {
      const payload = { currentPlayer: playerId, cardNumber: cardId };
      console.log('Selecting card with ID:', cardId);
      stompClient.publish({ destination: '/app/room/1/actionCardClick', body: JSON.stringify(payload) });
    } else {
      console.error('stompClient is not initialized');
    }
  };

  const sendCardId = () => {
    if (cardId) {
      selectCard(cardId);
    } else {
      alert('Please enter a card ID');
    }
  };  

  const handleMajorImprovementCards = (message) => {
    const { playerId, majorImprovementCards } = message;

    if (playerId === currentPlayerID) {
      let cardListHtml = majorImprovementCards.map(card => `<li>${card.name}: ${card.description}</li>`).join('');
      setGameState((prevState) => prevState + `<div class="section-title">Your Major Improvement Cards</div>\n<ul>${cardListHtml}</ul>`);
      console.log('Major improvement cards displayed for player:', currentPlayerID, majorImprovementCards);
    } else {
      console.log('Received major improvement cards for player:', playerId, majorImprovementCards);
    }
  };

  const handlePlayerResources = (message) => {
    const { playerId, resources } = message;

    if (playerId === currentPlayerID) {
      let resourceListHtml = Object.entries(resources).map(([key, value]) => `<li>${key}: ${value}</li>`).join('');
      setGameState((prevState) => prevState + `<div class="section-title">Your Resources</div>\n<ul>${resourceListHtml}</ul>`);
      console.log('Player resources updated for player:', currentPlayerID, resources);
    } else {
      console.log('Received player resources for player:', playerId, resources);
    }
  };

  const handleValidPositions = (validPositionsMessage) => {
    const { playerId, actionType, validPositions } = validPositionsMessage;

    if (playerId === currentPlayerID) {
      let positionOptions = validPositions.map(pos => `<button class="position-button" onClick={() => selectPosition(${pos.x}, ${pos.y})">(${pos.x}, ${pos.y})</button>`).join('');
      if (actionType === 'plow') {
        setGameState((prevState) => prevState + `<div class="section-title">Select a Position to Plow</div>\n${positionOptions}`);
      } else if (actionType === 'house') {
        setGameState((prevState) => prevState + `<div class="section-title">Select a Position to Build a House</div>\n${positionOptions}`);
      } else if (actionType === 'barn') {
        setGameState((prevState) => prevState + `<div class="section-title">Select a Position to Build a Barn</div>\n${positionOptions}`);
      } else {
        console.log(`Unknown actionType: ${actionType}`);
      }
    }
  };

  const selectPosition = (x, y) => {
    if (stompClient) {
      const payload = { playerId: currentPlayerID, x: parseInt(x, 10), y: parseInt(y, 10) };
      console.log('Selecting position:', x, y);
      stompClient.publish({ destination: '/app/receiveSelectedPosition', body: JSON.stringify(payload) });
    } else {
      console.error('stompClient is not initialized');
    }
  };

  const handleChoiceRequest = (choiceRequest) => {
    const { playerId, choiceType, options } = choiceRequest;

    if (playerId === currentPlayerID && (choiceType === 'AndOr' || choiceType === 'Then' || choiceType === 'Or')) {
      let choiceOptions = Object.entries(options).map(([key, value], index) =>
        `<button class="choice-button" onClick={() => selectChoice('${choiceType}', ${index})}>${value}</button>`
      ).join('');

      setGameState((prevState) => prevState + `<div class="section-title">Make a Choice</div>\n${choiceOptions}`);
    }
  };

  const selectChoice = (choiceType, choice) => {
    if (stompClient) {
      let payload;
      if (choiceType === 'AndOr') {
        payload = { playerId: currentPlayerID, choiceType: choiceType, choice: choice };
      } else if (choiceType === 'Then' || choiceType === 'Or') {
        const booleanChoice = choice === 0;
        payload = { playerId: currentPlayerID, choiceType: choiceType, choice: booleanChoice };
      }
      console.log('Selecting choice:', choiceType, choice);
      stompClient.publish({ destination: '/app/playerChoice', body: JSON.stringify(payload) });
    } else {
      console.error('stompClient is not initialized');
    }
  };

  const handleActiveCards = (message) => {
    const { playerId, majorImprovementCards } = message;

    if (playerId === currentPlayerID) {
      let cardListHtml = majorImprovementCards.map(card => `<li>${card.name}: ${card.description}</li>`).join('');
      setGameState((prevState) => prevState + `<div class="section-title">Your Active Cards</div>\n<ul>${cardListHtml}</ul>`);
      console.log('Active cards displayed for player:', currentPlayerID, majorImprovementCards);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Next.js WebSocket Game</h1>
      <div id="gameState" dangerouslySetInnerHTML={{ __html: gameState }} />
      <button id="startGameButton" onClick={startGame}>Start Game</button>
      <button id="viewExCardsButton" onClick={viewExchangeableCards}>View Exchangeable Cards</button>
      <input id="cardIdInput" type="text" value={cardId} onChange={(e) => setCardId(e.target.value)} />
      <button id="sendCardIdButton" onClick={sendCardId}>Send Card ID</button>
      <div id="exchangePopup" style={{ display: 'none' }}>
        <button id="closePopupButton" onClick={() => document.getElementById('exchangePopup').style.display = 'none'}>Close</button>
        <div id="exchangeButtons" dangerouslySetInnerHTML={{ __html: exchangeableCards }} />
      </div>
    </div>
  );
}
