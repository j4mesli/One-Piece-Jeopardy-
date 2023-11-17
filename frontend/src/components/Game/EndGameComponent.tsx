import { EndGame } from "../../types/EndGame";

interface EndGameProps {
  endGame: EndGame;
  difficulties: { [key: string]: number };
  category: string;
}

function EndGameComponent(props: EndGameProps) {

  const evaluateFinalScore = () => {
    const score = props.endGame.score;
    const multiplier = props.difficulties[props.category];
    const color = score === 3*multiplier ? "green" : (score === 2*multiplier ? "yellow" : "red");
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
              <h6><b>Points Earned: </b>{result.score > 0 ? <span style={{ color: "green" }}>{result.score}</span> : <span style={{ color: "red" }}>{result.score}</span>}</h6>
            </div>
          );
        })}
        </div>
      </div>
    );
}

export default EndGameComponent;