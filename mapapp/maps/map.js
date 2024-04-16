import React, { useState, useEffect, useRef, forwardRef } from "react";
import Image from "next/image";
import { app } from "@/firebase";
import { getAuth } from 'firebase/auth';
import { getTitles, getQuestions, getScore } from "@/data/fetch";
import { setUserScoreWithLevel } from '@/data/set';
import { saveToLocalStorage } from './data';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { CircularProgress } from '@mui/material';
import { SingleMarker } from './single';
import { MultipleMarker } from './multiple';
import { RestrictedMarker } from './restricted';
import { ConfirmationDialogMaps } from "../components/dialog";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import { keyExists, checkScore, avgScore } from "./utils";
import styles from "../styles/map.module.css";
import commonStyles from "../styles/common.module.css";
import mapbg from '../images/map-bg.png'

const render = (status) => {
  if (status === Status.LOADING) return <div style={{textAlign:'center'}}><CircularProgress /></div>;
  if (status === Status.FAILURE) return <div>{status}!</div>;
  return null;
};

const MapGuess = ({ quizData: data, quizDataError: error, category, title }) =>  {
    const [open, setOpen] = useState(false);
    const [postOpen, setPostOpen] = useState(false);
    const [start, setStart] = useState(false);
    const [startTimer, setStartTimer] = useState(false);
    const [end, setEnd] = useState(false);
    const [gameSettings, setGameSettings] = useState(null);
    const [score, setScore] = useState(0); // holds score directly from quiz
    const [quizScore, setQuizScore] = useState([]); // holds score from database
    const [quizTime, setQuizTime] = useState(0); // holds score from database

    const auth = getAuth(app);

    const getQuizTime = (time) => {
      setQuizTime(time);
    }

    const getQuizScore = async (currentScore, otherParams) => {
      //setScore(currentScore);
      const params = {'time': quizTime, ...otherParams};
      //console.log(params)
      //await setUserScoreWithLevel(auth.currentUser.email, category, title.id, gameSettings?.id, currentScore, params);
      saveToLocalStorage(title.id, gameSettings?.id, currentScore, params)
    }

    useEffect(() => {
      setStart(false);
    }, [title?.id])

    useEffect(() => {
      if (title?.id) {
        // Get the value from local storage if it exists
        const localdata = JSON.parse(localStorage.getItem("quizac")) || {}
        setQuizScore(localdata[title?.id])
        //console.log(JSON.parse(localStorage.getItem("quizac")) || "")
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title?.id, start, gameSettings?.id])

    const writeDescription = (item) => {
        let desc = ''
        desc = `${item.name}: In this level you can score a maximum of ${item.points} points (${item.points} per question). You have ${item.duration} seconds to answer each question. `;
        desc += item.deduction ? `Beware, if you fail a question, ${item.deduction > 1 ? item.deduction+' points' : item.deduction+' point'} will be deducted from your score. ` : '';
        desc += `Good luck!`;
        return desc;
    }

    const mapMaster = (settings) => {
        setGameSettings(settings);
        setStart(true);
        setOpen(true);
    }

    const closePreDialog = () => {
      setOpen(false);
      setStartTimer(true);
    }

    const showAlert = () => {
      setPostOpen(true)
      setEnd(true);
    }

    const closePostDialog = () => {
      setStartTimer(false);
      setEnd(false)
      setStart(false);
    }

    //Handle the quizDataError state
    if (error) return <div>Sorry, could not load the quiz</div>;
    //Handle the quizData loading state
    if (!data) return <div>Loading...</div>;

    return (
        <>
        {!start ? (
            <div className={commonStyles.quizContainer}>
              <div className={commonStyles.introHeader}>Explore the sights of Lagos!</div>
              <Image
                alt="Map"
                src={mapbg}
                placeholder="blur"
                quality={100}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  opacity: 0.2
                }}
              />
              <div className={commonStyles.introContent}>
                <div className={commonStyles.quizTitle}>
                
                </div>
                <div className={commonStyles.quizLevelContainer}>
                  {data.maps.levels.map((item, i) => (
                    <React.Fragment key={i}>
                      {
                        keyExists(item.id, quizScore) 
                        ? quizScore[item.id]?.length 
                          ? <div className={commonStyles.scoreBadge}>Score: {avgScore(quizScore[item.id], true)}</div> 
                          : ''
                        : ''
                      }
                      {checkScore(score, item.id, gameSettings?.id, quizScore) 
                      ? <div className={`${commonStyles.quizLevel} ${commonStyles.disabledLevel}`} >
                          <div className={commonStyles.levelName}><Image src={`/levels/trophy-${item.id}.png`} width="48" height="48" alt={`Level-${item.id}`} /></div>
                          <div className={commonStyles.levelDescription}>Level {i}</div>
                        </div>
                      : <div
                          className={`${commonStyles.quizLevel} ${styles[item.name]}`}
                          onClick={() => mapMaster(item)}
                        >
                          <div className={commonStyles.levelName}><Image src={`/levels/trophy-${item.id}.png`} width="48" height="48" alt={`Level-${item.id}`} /></div>
                          <div className={commonStyles.levelDescription}>Level {i}</div>
                          <div className={commonStyles.levelScore}>
                          {
                            keyExists(item.id, quizScore) 
                            ? quizScore[item.id]?.length 
                              ? avgScore(quizScore[item.id], true)
                              : ''
                            : ''
                          }
                          </div>
                        </div>
                      }
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <ConfirmationDialogMaps
                  id="pre-quiz"
                  keepMounted
                  open={open}
                  onClose={closePreDialog}
                  title="Are you ready?"
                  content=""
                  prompt="Go!"
                  //value={value}
              />
              <div className={styles.alertBox}>
                <Collapse in={!open && startTimer && end}>
                  <Alert 
                    severity="success"
                    action={
                      <Button color="inherit" size="small" onClick={()=>closePostDialog()}>
                        Try another
                      </Button>
                    }
                  >
                    Congratulations! — you scored great!
                  </Alert>
                  </Collapse>
              </div>
              <Wrapper apiKey="AIzaSyCfDcAwQpZwQFFftgsXsO5Kan9Xixsc7U0" render={render}>
                  {
                  gameSettings.type === 'single'
                  ? <SingleMarker settings={gameSettings} title={title} timerStart={startTimer} showAlert={showAlert} getScore={getQuizScore} getTime={getQuizTime} endQuiz={()=>setStart(false)} />
                  : gameSettings.type === 'multiple'
                      ? <MultipleMarker settings={gameSettings} title={title} timerStart={startTimer} showAlert={showAlert} getScore={getQuizScore} getTime={getQuizTime} endQuiz={()=>setStart(false)} />
                      : <RestrictedMarker settings={gameSettings} title={title} timerStart={startTimer} showAlert={showAlert} getScore={getQuizScore} getTime={getQuizTime} endQuiz={()=>setStart(false)} />
                  }
              </Wrapper>
            </>
          )}
        </>
    )
}

export default MapGuess;
