import { useEffect, useState } from "react";
import { EndGame } from "../../types/EndGame";
import UserSession from "../../types/UserSession";

interface EndGameProps {
  endGame: EndGame;
  difficulties: { [key: string]: number };
  category: string;
}

function EndGameComponent(props: EndGameProps) {
  const [difficulties, setDifficulties] = useState({} as { [key: string]: number });
  // useEffect for getting category difficulties
  useEffect(() => {
    const endpoint = `http://localhost:3000/getDifficulties`;
    const session: UserSession = JSON.parse(sessionStorage.getItem('session')!);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("sessionId", session.sessionId);
    const getCategoryDifficulties = async () => {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: headers,
      });
      const data = await res.json();
      setDifficulties(data.difficulties);
    }
    getCategoryDifficulties();
  }, []);

  const evaluateFinalScore = () => {
    const category = props.category !== '' ? props.category : JSON.parse(sessionStorage.getItem('recentGame')!).game.category;
    const score = props.endGame.score.toString() !== '' ? props.endGame.score : JSON.parse(sessionStorage.getItem('recentGame')!).game.score;
    const multiplier = props.difficulties[category] ? props.difficulties[category] : difficulties[category];
    const color = score > 2*multiplier ? "green" : (score > multiplier ? "yellow" : "red");
    return (<span style={{ color: color }}>{score}</span>);
  }

  return (
    <div className="endgame">
      <h1>Game Over!</h1>
      <h2>Final Score: {evaluateFinalScore()}</h2>
      <h2>Results:</h2>
      <div className="results">
      {props.endGame.results.map((result, index) => {
        return (
          <div className="result-mapper" key={index}>
            <h6><b>Question {index + 1}: </b>{result.question}</h6>
            <h6><b>Your Answer: </b>{result.response}</h6>
            <h6><b>Correct Answer: </b>{result.answer}</h6>
            <h6><b>Points Earned: {result.points > 0 ? <span style={{ color: "green" }}>{result.points}</span> : <span style={{ color: "red" }}>{result.points}</span>}</b></h6>
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default EndGameComponent;