import { useEffect, useState } from "react";
import "./Game.css";

function Game() {
  const [showGame, setShowGame] = useState(true);
  const [score, setScore] = useState(0);

  const deleteTests = async () => {
    const res = await fetch("https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com/deleteTest", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "sessionId": JSON.parse(sessionStorage.getItem("session")!).sessionId,
        "username": JSON.parse(sessionStorage.getItem("session")!).username,
      }
    });
    const data = await res.json();
    if (data.status === 200) {
      console.log("Success");
      setScore(0);
      setShowGame(true);
      const sesh = JSON.parse(sessionStorage.getItem("session")!);
      delete sesh["score"];
      sessionStorage.setItem("session", JSON.stringify(sesh));
    }
    else {
      console.log("Error deleting test" + data.message);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const answers: string[] = [];
    const sessionId = JSON.parse(sessionStorage.getItem("session")!).sessionId;
    for (let i = 0; i < questions.length; i++) {
      answers.push(event.currentTarget[""+i].value);
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("sessionId", sessionId);
    headers.append("answers", JSON.stringify(answers));
    const res = await fetch("https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com/evaluateTest", {
      method: "GET",
      headers: headers
    });
    const data = await res.json();
    if (data.status === 200) {
      setShowGame(false);
    }
    console.log(data);
    setScore(data.score);
    const sesh = JSON.parse(sessionStorage.getItem("session")!);
    sesh["score"] = data["score"];
    console.log(sesh)
    sessionStorage.setItem("session", JSON.stringify(sesh));
  };

  // PLACEHOLDER GAME, CHANGE FOR REAL LOGIC LATER
  const [questions, setQuestions] = useState<[{question: string}]>([] as unknown as [{question: string}]);
  useEffect(() => {
    const sessionScore = JSON.parse(sessionStorage.getItem("session")!).score;
    if (sessionScore) {
      setShowGame(false);
      setScore(sessionScore);
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("sessionId", JSON.parse(sessionStorage.getItem("session")!).sessionId);
    const fetchData = async () => {
      const res = await fetch("https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com/fetchTestQuestions", {
        method: "GET",
        headers: headers
      });
      const data = await res.json();
      if (data.status === 200) {
        setQuestions(data.questions);
      }
      else {
        console.log("Error getting questions");
      }
    };
    fetchData();
  }, []);
  return (
    <div className="game">
      <h1>Game</h1>
      { showGame ? (
        <form className="game-form" action="https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com" onSubmit={handleSubmit}>
        <ul>
          { questions.map((question, index) => {
            return (
              <li key={ index }>
                {question.question}
                <input type="text" name={""+index} required></input>
              </li>
            );
          }) }
          <input type="submit" value="Submit"></input>
        </ul>
      </form>
      ) : (
        <div>
          <p>Score: {score}</p>
          <p>Click <a onClick={deleteTests}>here</a> to delete your game!</p>
        </div>
      )}
    </div>
  );
}

export default Game;
