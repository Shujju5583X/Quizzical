export default function Questions({ questions, handleSelectAnswer, gameStatus }) {
  const questionElements = questions.map((q) => {
    const choiceElements = q.choices.map((choice, index) => {
      // Determine CSS classes for styling options
      let btnClass = "choice-btn";
      
      if (gameStatus === 'checking') {
        if (choice === q.correctAnswer) {
          btnClass += " correct";
        } else if (choice === q.selectedAnswer) {
          btnClass += " incorrect";
        } else {
          btnClass += " faded";
        }
      } else {
        if (choice === q.selectedAnswer) {
          btnClass += " selected";
        }
      }

      return (
        <button
          key={choice}
          className={btnClass}
          onClick={() => handleSelectAnswer(q.id, choice)}
          disabled={gameStatus === 'checking'}
        >
          {choice}
        </button>
      );
    });

    return (
      <div key={q.id} className="question-card">
        <h2 className="question-text">{q.question}</h2>
        <div className="choices-container">
          {choiceElements}
        </div>
        <hr className="question-divider" />
      </div>
    );
  });

  return (
    <div className="questions-list">
      {questionElements}
    </div>
  );
}
