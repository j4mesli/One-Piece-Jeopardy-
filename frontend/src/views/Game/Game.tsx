/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./Game.css";
import CategorySelection from "../../components/Game/CategorySelection";
import UserSession from "../../types/UserSession";
import { responseArr } from "../../types/responseArr";
import GameQuestion from "../../components/Game/GameQuestion";

function Game() {
  const [inGame, setInGame] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [category, setCategory] = useState("");
  const [responseArray] = useState([] as responseArr);
  const [currQuestion, setCurrQuestion] = useState("");
  const [index, setIndex] = useState(0);
  const userSessionObject: UserSession = JSON.parse(sessionStorage.getItem('session')!);

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
      console.log(responseArray);
      submitAnswer();
    }
  }, [index]);

  const handleSelection = (category: string) => () => {
    setCategory(category);
  };

  const fetchQuestion = async (index: number) => {
    const endpoint = `http://localhost:3000/fetchQuestion`;
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
    const endpoint = `http://localhost:3000/evaluateQuestions`;
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
    console.log(data);
  };

  return (
    <div className="game">
      <h1><i>One Piece</i> Jeopardy!</h1>
      {!inGame && <CategorySelection makeSelection={handleSelection} />}
      {showQuestion && <GameQuestion makeAnswer={handleAnswer} index={index} question={currQuestion} />}
    </div>
  );
}

export default Game;
