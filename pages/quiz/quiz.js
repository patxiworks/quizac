import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const dataCollection = collection(db, 'quizz');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const fetchedQuestions = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            question: data.questions,
            options: data.options,
            answer: data.answer,
          };
        });
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (timer > 0 && !isQuizEnded) {
      const countdown = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimer(10);
      } else {
        endQuiz();
      }
    }
  }, [timer, isQuizEnded, currentQuestionIndex]);

  const handleOptionChange = (event) => {
    if (!isQuizEnded) {
      const newSelectedOptions = [...selectedOptions];
      newSelectedOptions[currentQuestionIndex] = event.target.value;
      setSelectedOptions(newSelectedOptions);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setTimer(10);
  };

  const endQuiz = async () => {
    setIsQuizEnded(true);

    if (!quizSubmitted) {
      let finalScore = 0;
      for (let i = 0; i < questions.length; i++) {
        if (selectedOptions[i] === questions[i].answer) {
          finalScore++;
        }
      }
      setScore(finalScore);
      setQuizSubmitted(true);

      const docRef = await addDoc(collection(db, "quizresult"), {
        score: finalScore,
      });

      const newCol = collection(db, "quizresult", docRef.id, "scores");
    }
  };

  return (
    <div>
      <h1>Quiz Game</h1>
      {isQuizEnded ? (
        <div>
          <p>Quiz Ended</p>
          <p>Final Score: {score}</p>
        </div>
      ) : (
        <div>
          <p>{timer > 0 ? `Time Remaining: ${timer} seconds` : ''}</p>
          {questions.length > 0 && (
            <div>
              <h2>{questions[currentQuestionIndex].question}</h2>
              <form>
                {questions[currentQuestionIndex].options.map(
                  (option, optionIndex) => (
                    <label key={optionIndex}>
                      <input
                        type="radio"
                        value={option}
                        checked={selectedOptions[currentQuestionIndex] === option}
                        onChange={handleOptionChange}
                      />
                      {option}
                    </label>
                  )
                )}
              </form>
              {currentQuestionIndex < questions.length - 1 && (
                <button onClick={handleNextQuestion}>Next Question</button>
              )}
              {currentQuestionIndex === questions.length - 1 && (
                <button onClick={endQuiz}>Submit</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
