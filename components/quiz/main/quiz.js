import { useState, useEffect } from "react";
//import questions from "./questions.json";
import Progress from "./progress";
import { getTitles, getQuestions } from "@/data/fetch";
import styles from "./styles/quiz.module.css";

function Quiz({ category, title }) {
    const [level, setLevel] = useState("");
    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
      if (title) {
        getQuestions(category, title, setAllQuestions); // get all questions
      }
    }, [title]);

    useEffect(() => {
      if (allQuestions.length) {
        const getMultipleRandom = (arr, num) => {
          const shuffled = [...arr].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, num);
        }
        setQuestions(getMultipleRandom(allQuestions, 10));
      }
    }, [allQuestions])
  
    const handleLevelSelection = (selectedLevel) => {
      setLevel(selectedLevel);
      setCurrentQuestion(0);
      setScore(0);
    };
  
    const handleOptionClick = (selectedOption) => {
      const isCorrect =
        selectedOption === questions[currentQuestion].answer;
      if (isCorrect) {
        setScore(score + 1);
      }
  
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        alert(`Your score is ${score}/${questions.length}`);
        setLevel("");
      }
    };
  
    return (
      <>
      { questions && questions.length ? 
      <div className={styles.quizContainer}>
        {level === "" ? (
          <>
            <div className={styles.quizTitle}>Choose a level</div>
            <div className={styles.quizLevelContainer}>
              <button
                className={`${styles.quizLevel} ${styles.easy}`}
                onClick={() => handleLevelSelection("easy")}
              >
                Level 1
              </button>
              <button
                className={`${styles.quizLevel} ${styles.hard}`}
                onClick={() => handleLevelSelection("medium")}
              >
                Level 2
              </button>
              <button
                className={`${styles.quizLevel} ${styles.hard}`}
                onClick={() => handleLevelSelection("hard")}
              >
                Level 3
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.quizQuestionContainer}>
              <p className={styles.quizQuestionCounter}>
                Question {currentQuestion + 1}/{questions.length}
              </p>
              <Progress
                  numCurrentQuestion={currentQuestion + 1}
                  numTotalQuestions={questions.length}
                />
              <h2 className={styles.quizQuestion}>
                {questions[currentQuestion].question}
              </h2>
              <ul className={styles.quizOptions}>
                {questions[currentQuestion].options.map((option) => (
                  <li
                    key={option}
                    className={styles.quizOption}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.quizScoreContainer}>
              <p className={styles.quizScore}>Score: {score}</p>
            </div>
          </>
        )}
      </div>
      : 
      <div className={styles.quizContainer}>
        <div className={styles.quizTitle}>Sorry, no questions available</div>
      </div>
      }
      </>
    );
  }
  
  export default Quiz;