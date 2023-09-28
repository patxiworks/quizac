import React, { useState, useEffect } from "react";
import Image from "next/image";
import Progress from "./components/progress";
import { app, db } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import { getTitles, getQuestions, getScore } from "@/data/fetch";
import { setUserScoreWithLevel } from '@/data/set';
import styles from "./styles/quiz.module.css";

function Quiz({ quizData, quizDataError, category, title }) {
  const [level, setLevel] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentLevelData, setCurrentLevelData] = useState({});
  const [timer, setTimer] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [levels, setLevels] = useState([]);
  const [quizScore, setQuizScore] = useState([]);
  const [sumScore, setSumScore] = useState(0);

  const auth = getAuth(app);

  useEffect(() => {
    if (title) {
      getScore(auth.currentUser.email, category, title, setQuizScore);
    }
    setSumScore(quizScore[1]?.reduce((a, o) => a + o.score, 0));
  }, [title, level])

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
      setLevels(quizData.levels);
    }
    if (quizData) fetchLevels();
  }, [quizData]);
  
  useEffect(() => {
    if (currentLevel <= levels.length) {
      const currentLevelData = levels[currentLevel - 1];
      setTimer(currentLevelData?.duration || 10); 
    }
  }, [currentLevel, levels]);
  
  /*useEffect(() => {
    if (currentLevel <= level.length) {
      setTimer(levels[currentLevel - 1]?.duration || 10);
    }
  }, [currentLevel, level]);*/

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0 && isQuizStarted) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
        if (isQuizStarted) {
          handleOptionClick();
        }
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, isQuizStarted]);

  const handleLevelSelection = async (selectedLevel) => {
    setLevel(selectedLevel);
    setCurrentLevel(selectedLevel); 
  
    const selectedLevelData = levels.find((l) => l.number === selectedLevel);
    setCurrentLevelData(selectedLevelData);
  
    if (selectedLevelData) {
      setTimer(selectedLevelData.duration || 10); 
    } else {
      setTimer(10);
    }
    setIsQuizStarted(true);
    setCurrentQuestion(0); 
    setScore(0);
  };
  
  const handleOptionClick = async (selectedOption) => {
    if (questions.length > 0 && currentQuestion >= 0 && currentQuestion < questions.length) {
      const isCorrect = selectedOption === questions[currentQuestion].answer;
      let currentScore;
      
      if (isCorrect) {
        currentScore = score + currentLevelData?.points || 1
        setScore(currentScore);
        console.log(score)
      }
  
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setTimer(currentLevelData?.duration || 10);
      } else {
        setIsQuizStarted(false);
        if (auth.currentUser) {
          await setUserScoreWithLevel(auth.currentUser.email, category, title, level, currentScore);
        } else {
          console.error('User is not authenticated.');
        }
      }
    }
  };

  const errorMessage = (message) => {
    return (
      <div className={styles.quizContainer}>
          <div className={styles.quizTitle}>{message}</div>
      </div>
    )
  }

  //Handle the quizDataError state
  if (quizDataError) return errorMessage('Sorry, could not load the quiz');
  //Handle the quizData loading state
  if (!quizData) return <div>Loading...</div>;

  return (
    <>
      {questions && questions.length ?
        <div className={styles.quizContainer}>
          {levels && !isQuizStarted ? (
            <>
              <div className={styles.quizTitle}>Choose a level</div>
              <div className={styles.quizLevelContainer}>
                {levels.map((item, i) => (
                  <React.Fragment key={i}>
                    {
                      score && item.number==level 
                      ? <div className={styles.scoreBadge}>Score: {score}</div>
                      : quizScore[item.number]?.length 
                        ? <div className={styles.scoreBadge}>Score: {quizScore[item.number]?.reduce((a, o) => a + o.score, 0)}</div> 
                        : ''
                    }
                    <div
                      className={`${styles.quizLevel} ${styles[item.name]}`}
                      onClick={() => handleLevelSelection(item.number)}
                    >
                      <div className={styles.levelName}><Image src={`/levels/trophy-${item.number}.png`} width="64" height="64" alt={`Level-${item.number}`} /></div>
                      <div className={styles.levelDescription}>The process of preparing freshly sliced yam reflects the deep connection between Nigerians and this cherished tuber.</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={styles.timer}></div>
              <div className={styles.quizQuestionContainer}>
                <p className={styles.quizQuestionCounter} style={timer<6 ? { color: "#ff0000" } : {}}>
                 {timer} seconds
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
        errorMessage(<CircularProgress />)
      }
    </>
  );
}

export default Quiz;