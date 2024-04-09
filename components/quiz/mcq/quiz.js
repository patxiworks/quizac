import React, { useState, useEffect } from "react";
import Image from "next/image";
import Progress from "../components/progress";
import { app, db } from '../../../firebase';
import { getAuth } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import { getTitles, getQuestions, getScore } from "@/data/fetch";
import { setUserScoreWithLevel } from '@/data/set';
import QuizDisplay from "./display";
import { ConfirmationDialog } from "../quiz-dialog";
import { keyExists, checkScore, avgScore } from "../utils";
import styles from "../styles/quiz.module.css";
import commonStyles from "../styles/common.module.css";

function Quiz({ quizData, quizDataError, category, title }) {
  const [level, setLevel] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentLevelData, setCurrentLevelData] = useState({});
  const [timer, setTimer] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [levels, setLevels] = useState([]);
  const [quizScore, setQuizScore] = useState([]);
  const [sumScore, setSumScore] = useState(0);
  const [open, setOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);

  const auth = getAuth(app);

  useEffect(() => {
    if (title) {
      getScore(auth.currentUser.email, category, title, setQuizScore);
    }
    //setSumScore(quizScore[1]?.reduce((a, o) => a + o.score, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, level])

  useEffect(() => {
    if (title) {
      getQuestions(category, title, setAllQuestions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    /*if (currentLevel <= levels.length) {
      const currentLevelData = levels[currentLevel - 1];
      setTimer(currentLevelData?.duration || 10); 
    }*/
  }, [currentLevel, levels]);
  
  /*useEffect(() => {
    if (currentLevel <= level.length) {
      setTimer(levels[currentLevel - 1]?.duration || 10);
    }
  }, [currentLevel, level]);*/

  /*useEffect(() => {
    /*const countdown = setInterval(() => {
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
  }, [timer, isQuizStarted]);*/

  const handleLevelSelection = async (selectedLevel) => {
    setLevel(selectedLevel);
    setCurrentLevel(selectedLevel); 
  
    const selectedLevelData = levels.find((l) => l.number === selectedLevel);
    setCurrentLevelData(selectedLevelData);
  
    if (selectedLevelData) {
      setTimer(selectedLevelData?.duration || 10); 
    }
  };

  const openPreDialog = (selectedLevel) => {
    setOpen(true); // open dialog box
    handleLevelSelection(selectedLevel); // set level data
    setIsQuizStarted(true); // display quiz interface on page
    setStartTimer(false); // [do not] begin timer countdown
    setCurrentQuestion(0); // start from first question
    setScore(0); // set initial score
  };

  const closePreDialog = () => {
    setOpen(false); // close dialog
    setStartTimer(true); // begin timer countdown
  }

  const closePostDialog = () => {
    setIsQuizStarted(false);
    setPostOpen(false);
  }
  
  const handleOptionClick = async (selectedOption) => {
    if (questions.length > 0 && currentQuestion >= 0 && currentQuestion < questions.length) {
      const isCorrect = selectedOption === questions[currentQuestion].answer;
      let currentScore;
      
      if (isCorrect) {
        currentScore = score + currentLevelData?.points || 1
        setScore(currentScore);
      } else {
        currentScore = score;
      }
  
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) { // if the final question has not been completed
        setCurrentQuestion(nextQuestion);
        //setTimer(currentLevelData?.duration || 10);
        setResetTimer(prev => !prev);
      } else {
        //setIsQuizStarted(false);
        setPostOpen(true);
        if (auth.currentUser) {
          await setUserScoreWithLevel(auth.currentUser.email, category, title, level, currentScore);
        } else {
          console.error('User is not authenticated.');
        }
      }
    }
  };

  const writeDescription = (item) => {
    let desc = ''
    desc = `${item.name}: In this level you can score a maximum of ${item.points*questions.length} points (${item.points} per question). You have ${item.duration} seconds to answer each question. `;
    desc += item.deduction ? `Beware, if you fail a question, ${item.deduction > 1 ? item.deduction+' points' : item.deduction+' point'} will be deducted from your score. ` : '';
    desc += `Good luck!`;
    return desc;
  }

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
                      (score || score === 0) && item.number==level
                      ? <div className={styles.scoreBadge}>Score: {score}</div>
                      : keyExists(item.number, quizScore) 
                        ? quizScore[item.number]?.length 
                          ? <div className={styles.scoreBadge}>Score: {avgScore(quizScore[item.number])}</div> 
                          : ''
                        : ''
                    }
                    {checkScore(score, item.number, level, quizScore) 
                    ? <div className={`${styles.quizLevel} ${styles.disabledLevel}`} >
                        <div className={styles.levelName}><Image src={`/levels/trophy-${item.number}.png`} width="64" height="64" alt={`Level-${item.number}`} /></div>
                        <div className={styles.levelDescription}>{writeDescription(item)}</div>
                      </div>
                    : <div
                        className={`${styles.quizLevel} ${styles[item.name]}`}
                        onClick={() => openPreDialog(item.number)}
                      >
                        <div className={styles.levelName}><Image src={`/levels/trophy-${item.number}.png`} width="64" height="64" alt={`Level-${item.number}`} /></div>
                        <div className={styles.levelDescription}>{writeDescription(item)}</div>
                      </div>
                    }
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : (
            <>
              <ConfirmationDialog
                id="pre-quiz"
                keepMounted
                open={open}
                onClose={closePreDialog}
                title="Are you ready?"
                content=""
                prompt="Go!"
                //value={value}
              />
              <QuizDisplay 
                timer={{
                  initial: timer, 
                  start: startTimer, 
                  reset: resetTimer, 
                  stop: stopTimer
                }}
                score={score} 
                currentQuestion={currentQuestion} 
                questions={questions} 
                handleOptionClick={handleOptionClick}
              />
              <ConfirmationDialog
                id="post-quiz"
                keepMounted
                open={postOpen}
                onClose={closePostDialog}
                content={`You scored ${score} out of ${currentLevelData?.points*questions.length}`}
                title="Your result!"
                prompt="Continue"
                //value={value}
              />
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
