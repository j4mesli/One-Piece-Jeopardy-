interface GameQuestionProps {
    question: string;
    index: number;
    makeAnswer: (answer: string) => () => void;
}

function GameQuestion(props: GameQuestionProps) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const answer = (document.getElementById("answer") as HTMLInputElement).value;
        props.makeAnswer(answer)();
    }

    return (
      <div className="game-question">
        <h3>Question #{props.index + 1}</h3>
        <form onSubmit={handleSubmit}>
            <div className="question"><h5>{props.question}</h5></div>
            <input type='text' name='answer' id="answer" placeholder="What/Who is..." required/>
            <button type="submit">Submit</button>
        </form>        
      </div>
    );
}

export default GameQuestion;