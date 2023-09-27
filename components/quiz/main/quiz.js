import { useState, useEffect } from "react";
//import questions from "./questions.json";
import Progress from "./progress";
import { getTitles, getQuestions } from "@/data/fetch";
import { collection, getDocs,getDoc, doc } from 'firebase/firestore';
import styles from "./styles/quiz.module.css";
import { db } from '../../../firebase'

function Quiz({ category, title }) {
  const [level, setLevel] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [timer, setTimer] = useState(0);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [levels, setLevels] = useState([]);


  useEffect(() => {
    if (title) {
      getQuestions(category, title, setAllQuestions); 
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

  useEffect(() => {
    async function fetchLevels() {
      const levelsCollection = collection(db, 'levels');
      const querySnapshot = await getDocs(levelsCollection);
      const levelData = querySnapshot.docs.map((doc) => doc.data());
      setLevels(levelData);
    }
    fetchLevels();
  }, []);
  
  useEffect(() => {
    if (currentLevel <= levels.length) {
      const currentLevelData = levels[currentLevel - 1];
      setTimer(currentLevelData?.duration || 10); 
    }
  }, [currentLevel, levels]);
  

  
  useEffect(() => {
    if (currentLevel <= level.length) {
      setTimer(levels[currentLevel - 1]?.duration || 10);
    }
  }, [currentLevel, level]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0 && !isQuizEnded) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
        if (!isQuizEnded) {
          handleOptionClick();
        }
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, isQuizEnded]);

  const handleLevelSelection = async (selectedLevel) => {
    setLevel(selectedLevel);
    setCurrentLevel(selectedLevel); 
  
    const selectedLevelData = levels.find((level) => level.level === selectedLevel);
  
    if (selectedLevelData) {
      setTimer(selectedLevelData.duration || 10); 
    } else {
      setTimer(10);
    }
    setCurrentQuestion(0); 
    setScore(0);
  };
  
  const handleOptionClick = (selectedOption) => {
    if (questions.length > 0 && currentQuestion >= 0 && currentQuestion < questions.length) {
      const isCorrect = selectedOption === questions[currentQuestion].answer;
      
      if (isCorrect) {
        setScore(score + 1);
      }
  
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setTimer(levels[currentLevel - 1]?.duration || 10); 
      } else {
        alert(`Your score is ${score}/${questions.length}`);
        setLevel("");
      }
    }
  };

  return (
    <>
      {questions && questions.length ?
        <div className={styles.quizContainer}>
          {level === "" ? (
            <>
              <div className={styles.quizTitle}>Choose a level</div>
              <div className={styles.quizLevelContainer}>
                <button
                  className={`${styles.quizLevel} ${styles.easy}`}
                  onClick={() => handleLevelSelection("1")}
                >
                  Level 1
                </button>
                <button
                  className={`${styles.quizLevel} ${styles.hard}`}
                  onClick={() => handleLevelSelection("2")}
                >
                  Level 2
                </button>
                <button
                  className={`${styles.quizLevel} ${styles.hard}`}
                  onClick={() => handleLevelSelection("3")}
                >
                  Level 3
                </button>
              </div>
            </>
          ) : (
            <>
                 <div className={styles.timer}><p style={{ color: "#ff0000" }}>{timer} seconds</p></div>
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