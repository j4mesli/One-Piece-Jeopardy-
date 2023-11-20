/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./Game.css";
import CategorySelection from "../../components/Game/CategorySelection";
import UserSession from "../../types/UserSession";
import { responseArr } from "../../types/responseArr";
import GameQuestion from "../../components/Game/GameQuestion";
import { EndGame } from "../../types/EndGame";
import EndGameComponent from "../../components/Game/EndGameComponent";
import getMDY from "../../functions/getMDY";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";

function Game() {
  const [loading, setLoading] = useState(true);
  const [inGame, setInGame] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [category, setCategory] = useState("");
  const [difficulties, setDifficulties] = useState({} as { [key: string]: number });
  const [responseArray] = useState([] as responseArr);
  const [currQuestion, setCurrQuestion] = useState("");
  const [index, setIndex] = useState(0);
  const [endGame, setEndGame] = useState<EndGame | undefined>();
  const [showEndGame, setShowEndGame] = useState(false);
  const userSessionObject: UserSession = JSON.parse(sessionStorage.getItem('session')!);

  // useEffect for checking if played today
  useEffect(() => {
    const recentGameRaw = sessionStorage.getItem('recentGame');
    if (recentGameRaw) {
      const recentGame = JSON.parse(recentGameRaw);
      if (recentGame.timestamp === getMDY().toISOString()) {
        setInGame(true);
        setShowEndGame(true);
        setEndGame(recentGame.game);
      }
    }
    else {
      const endpoint = 'https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com/evaluatePlayedToday';
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("username", userSessionObject.username);
      headers.append("sessionId", userSessionObject.sessionId);
      const evaluatePlayed = async () => {
        const res = await fetch(endpoint, {
          method: "GET",
          headers: headers,
          });
        const data = await res.json();
        if (data.playedToday) {
          if (!sessionStorage.getItem('recentGame')) {
            const headers2 = new Headers();
            headers2.append("Content-Type", "application/json");
            headers2.append("username", userSessionObject.username);
            headers2.append("sessionId", userSessionObject.sessionId);
            const endpoint2 = `https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com/fetchMostRecentGame`;
            fetch(endpoint2, {
              method: "GET",
              headers: headers2,
            }).then(res => res.json())
            .then(data => {
              if (data.status >= 400) {
                alert(data.message);
              }
              else {
                const recentGame = {
                  game: {
                    category: data.category,
                    score: data.score,
                    results: data.results
                  },
                  timestamp: getMDY()
                }
                sessionStorage.setItem('recentGame', JSON.stringify(recentGame));
              }
            })
            .then(
              () => {
                setInGame(true);
                setShowEndGame(true);
                setEndGame(JSON.parse(sessionStorage.getItem('recentGame')!).game);
              }
            );
          }
          else {
            setInGame(true);
            setShowEndGame(true);
            setEndGame(data.recentGame);
          }
        }
      }
      evaluatePlayed();
    }
    setLoading(false);
  }, []);

  // useEffect for getting category difficulties
  useEffect(() => {
    const endpoint = `https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com/getDifficulties`;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("category", category);
    headers.append("sessionId", userSessionObject.sessionId);
    const getCategoryDifficulties = async () => {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: headers,
      });
      const data = await res.json();
      setDifficulties(data.difficulties);
    }
    getCategoryDifficulties();
  }, [category]);

  // useEffect for fetching first question after select
  useEffect(() => {
    if (category !== "") {
      fetchQuestion(0);
      setInGame(true);
    }
  }, [category]);

  // useEffect for setting question elem
  useEffect(() => {
    if (currQuestion !== "") {
      setShowQuestion(true);
    }
  }, [currQuestion]);

  // useEffect for incrementing index (getting next question)
  useEffect(() => {
    setShowQuestion(false);
    if (index < 3 && index > 0) {
      fetchQuestion(index);
    }
    else if (index === 3){
      submitAnswer();
    }
  }, [index]);

  // useEffect for handling end game
  useEffect(() => {
    if (endGame !== undefined) {
      handleEndGame();
    }
  }, [endGame]);

  // end game method
  const handleEndGame = () => {
    setShowEndGame(true);
    const recentGame = {
      game: endGame,
      timestamp: getMDY()
    }
    sessionStorage.setItem('recentGame', JSON.stringify(recentGame));
  }

  const handleSelection = (category: string) => () => {
    setCategory(category);
  };

  const fetchQuestion = async (index: number) => {
    const endpoint = `https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com/fetchQuestion`;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("category", category);
    headers.append("index", index.toString());
    headers.append("username", userSessionObject.username);
    headers.append("sessionId", userSessionObject.sessionId);
    const res = await fetch(endpoint, {
      method: "GET",
      headers: headers,
    });
    const data = await res.json();
    setCurrQuestion(data.question);
  }

  const handleAnswer = (answer: string) => () => {
    responseArray.push({ index, answer: answer });
    setIndex(index + 1);
  }

  const submitAnswer = async () => {
    const endpoint = `https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com/evaluateQuestions`;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("category", category);
    headers.append("index", index.toString());
    headers.append("username", userSessionObject.username);
    headers.append("sessionId", userSessionObject.sessionId);
    headers.append("responses", JSON.stringify(responseArray));
    const res = await fetch(endpoint, {
      method: "POST",
      headers: headers,
    });
    const data = await res.json();
    setEndGame(data);
  };

  return (
    <div className="game">
      { !loading ? <>
        {!inGame && <CategorySelection makeSelection={handleSelection} difficulties={difficulties} />}
        {showQuestion && <GameQuestion makeAnswer={handleAnswer} index={index} question={currQuestion} />}
        {showEndGame && <EndGameComponent endGame={endGame!} difficulties={difficulties} category={category} />}
      </> : <LoadingCircle /> }
    </div>
  );
}

export default Game;
