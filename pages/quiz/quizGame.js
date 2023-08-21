import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import styles from ".//quiz.module.css";


const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10); // Change the timer to 10 seconds per question
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

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
    const countdown = setInterval(() => {
      if (timer > 0 && !isQuizEnded) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
        handleNextQuestion();
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, isQuizEnded]);

  const handleOptionChange = (event, questionIndex) => {
    if (!isQuizEnded) {
      const newSelectedOptions = [...selectedOptions];
      newSelectedOptions[questionIndex] = event.target.value;
      setSelectedOptions(newSelectedOptions);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(10); // Reset the timer for the next question
    } else {
      endQuiz();
    }
  };

  const endQuiz = async () => {
    setIsQuizEnded(true);

    if (!quizSubmitted) {
      let userScore = 0;
      for (let i = 0; i < questions.length; i++) {
        if (selectedOptions[i] === questions[i].answer) {
          userScore++;
        }
      }
      setScore(userScore);
      setQuizSubmitted(true);

      const docRef = await addDoc(collection(db, "quizresult"), {
        score: userScore,
      });
    }
  };

  return (
    <div className={styles.quizContainer}>
    <h1 className={styles.quizTitle}>Quiz Game</h1>
    {isQuizEnded ? (
      <div className={styles.quizResults}>
        <p>Quiz Ended</p>
        <p>Final Score: {score}</p>
          {score === questions.length ? (
          <p>EXCELLENT !! YOU'RE THE QUIZ MASTER</p>
        ) : score > questions.length / 2 ? (
          <div>
            <p>GOOD JOB!!!</p>
            <p>You're on the right track! Keep up the good work.</p>
          </div>
        ) : (
          <div>
            <p>KEEP TRYING, YOU GOT THIS!!</p>
            <p>Don't give up! Every step takes you closer to success.</p>
          </div>
        )}
      </div>
   
      ) : (
        <div>
          <p className={styles.timer}>Time Remaining: {timer} seconds</p>
          {questions.length > 0 && (
            <div className={styles.questionContainer}>
              <h2 className={styles.question}>{questions[currentQuestionIndex].question}</h2>
              <form>
                {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                  <label key={optionIndex} className={styles.optionLabel}>
                    <input
                      type="radio"
                      value={option}
                      checked={selectedOptions[currentQuestionIndex] === option}
                      onChange={(event) => handleOptionChange(event, currentQuestionIndex)}
                    />
                    {option}
                  </label>
                ))}
              </form>
              <button
                className={styles.nextButton}
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;