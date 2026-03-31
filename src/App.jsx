import { useState } from 'react'
import Questions from './Questions.jsx'
import './index.css'

export default function App() {
  const [gameStatus, setGameStatus] = useState('start') // 'start', 'playing', 'checking'
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  function startQuiz() {
    setIsLoading(true);
    setError(null);

    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load quiz questions.')
        return res.json()
      })
      .then((data) => {
        const processedData = data.results.map((q, index) => {
          function decodeHTML(html) {
            const txt = document.createElement('textarea');
            txt.innerHTML = html;
            return txt.value;
          }
          
          let choices = [...q.incorrect_answers, q.correct_answer].map(decodeHTML);
          // Simple array shuffle
          choices.sort(() => Math.random() - 0.5);

          return {
            id: index,
            question: decodeHTML(q.question),
            choices: choices,
            correctAnswer: decodeHTML(q.correct_answer),
            selectedAnswer: null
          };
        });
        setQuestions(processedData);
        setGameStatus('playing');
        setScore(0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  function handleSelectAnswer(questionId, choice) {
    if (gameStatus === 'checking') return; // Disable changes after checking
    setQuestions(prevQuestions => prevQuestions.map(q => {
      return q.id === questionId ? { ...q, selectedAnswer: choice } : q;
    }));
  }

  function checkAnswers() {
    let currentScore = 0;
    questions.forEach(q => {
      if (q.selectedAnswer === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setGameStatus('checking');
  }

  function playAgain() {
    setGameStatus('start');
    setQuestions([]);
    setScore(0);
  }

  return (
    <main>
      <div className="blob blob-top"></div>
      <div className="blob blob-bottom"></div>
      
      <div className="app-container">
        {gameStatus === 'start' && (
          <div className="start-screen">
            <h1>Quizzical</h1>
            <p>This is a random quiz game questions can be from any category</p>
            <button
              className="btn start-btn"
              onClick={startQuiz}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Start quiz'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        )}
        
        {(gameStatus === 'playing' || gameStatus === 'checking') && (
          <div className="quiz-screen">
            <Questions 
              questions={questions} 
              handleSelectAnswer={handleSelectAnswer}
              gameStatus={gameStatus}
            />
            
            <div className="quiz-footer">
              {gameStatus === 'checking' && (
                <span className="score-text">You scored {score}/{questions.length} correct answers</span>
              )}
              {gameStatus === 'playing' ? (
                <button className="btn action-btn" onClick={checkAnswers}>Check answers</button>
              ) : (
                <button className="btn action-btn" onClick={playAgain}>Play again</button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
