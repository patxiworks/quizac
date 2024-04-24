import React, { useState, useEffect, useRef, forwardRef } from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation'
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
import { WhatsappIcon, FacebookIcon, TwitterIcon } from "react-share";
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton} from "react-share";
import CountUp from "react-countup";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import ShareIcon from '@mui/icons-material/Share';
import { keyExists, checkScore, avgScore } from "./utils";
import styles from "../styles/map.module.css";
import commonStyles from "../styles/common.module.css";
import mapbg from '../images/map-bg.png';
import singleDemo from '../images/single.gif';
import multipleDemo from '../images/multiple.gif';
import restrictedDemo from '../images/restricted.gif';

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
    const [showShare, setShowShare] = useState(false);
    const [openShare, setOpenShare] = useState(false);

    const auth = getAuth(app);
    const pathname = usePathname()

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
        switch (item.id) {
          case 1:
            desc = "Intro level. Guess the location in the map."
            break;
          case 2:
            desc = "Mid level. Choose a starting point and find the location."
            break;
          case 3:
            desc = "Boss level. Trace your way from a random point."
            break;
        }
        return desc;
    }

    const helpInfo = (settings) => {
      let text = '';
      let image = '';
      switch (settings.id) {
        case 1:
          image = singleDemo
          text = "Guess the location by clicking on the correct point in the map. You have " + settings.duration + " seconds."
          break;
        case 2:
          image = multipleDemo
          text = "Move from any point to the correct location in the map. You have " + settings.duration + " seconds for each point you choose."
          break;
        case 3:
          image = restrictedDemo
          text = "The marker is placed at a random point 20km from the location. Trace your way to the correct location within a restricted window. You have " + settings.duration + " seconds and a maximum of " + settings.maxattempts + " steps"
          break;
      }
      return [image, text];
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

    const closeShareDialog = () => {
      setOpenShare(false);
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

    const displayScore = (id, qs) => {
      if (keyExists(id, qs)) {
        if (qs[id]?.length) {
         return parseFloat(avgScore(qs[id], true))
        }
      }
      return '';
    }

    const aggregateScore = (qs) => {
      const scores = []
      let sum = 0
      for (let i=1; i<=3; i++) {
        scores.push(displayScore(i, qs))
        sum = sum + i
      }
      const agg = scores.map((score, i) => score*((i+1)/sum))
      //console.log(scores, agg)
      return agg.reduce((a, curr) => { return parseFloat(a + curr) },0);
    }

    const shareText = (score) => {
      return "I played the Lagos Mapping Game and scored " + score.toFixed(2) + ". Try it yourself: "+window.location.origin + pathname
    }

    //Handle the quizDataError state
    if (error) return <div>Sorry, could not load the quiz</div>;
    //Handle the quizData loading state
    if (!data) return <div>Loading...</div>;

    return (
        <>
        <ConfirmationDialogMaps
          id="share-buttons"
          //keepMounted
          open={openShare}
          onClose={closeShareDialog}
          title="Share your score!"
          content={
            <div className={commonStyles.shareButtons}>
              <div>
                <WhatsappShareButton url={shareText(aggregateScore(quizScore))}>
                  <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
              </div>
              <div>
                <FacebookShareButton url={shareText(aggregateScore(quizScore))}>
                  <FacebookIcon size={32} round={true} />
                </FacebookShareButton>
              </div>
              <div>
                <TwitterShareButton url={shareText(aggregateScore(quizScore))}>
                  <TwitterIcon size={32} round={true} />
                </TwitterShareButton>
              </div>
            </div>
          }
          prompt="Close"
          //value={value}
        />
        {!start ? (
            <div className={commonStyles.quizContainer}>
              <div className={commonStyles.introHeader}>Find this location in the map!</div>
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
                          <div className={commonStyles.levelName}><Image src={`/levels/map-${item.id}.png`} width="48" height="48" alt={`Level-${item.id}`} /></div>
                          <div className={commonStyles.levelDescription}>{writeDescription(item)}</div>
                          <div className={commonStyles.levelScore}>
                            <CountUp
                              start={gameSettings?.id === item?.id ? 0 : displayScore(item.id, quizScore)}
                              end={ displayScore(item.id, quizScore) }
                              decimals={2}
                            />
                          </div>
                        </div>
                      : <div
                          className={`${commonStyles.quizLevel} ${styles[item.name]}`}
                          onClick={() => mapMaster(item)}
                        >
                          <div className={commonStyles.levelName}><Image src={`/levels/map-${item.id}.png`} width="48" height="48" alt={`Level-${item.id}`} /></div>
                          <div className={commonStyles.levelDescription}>{writeDescription(item)}</div>
                          <div className={commonStyles.levelScore}>
                            <CountUp
                              start={gameSettings?.id === item?.id ? 0 : displayScore(item.id, quizScore)}
                              end={ displayScore(item.id, quizScore) }
                              decimals={2}
                            />
                          </div>
                        </div>
                      }
                    </React.Fragment>
                  ))}
                </div>
                <div className={commonStyles.aggScoreBox}>
                  Your aggregate score:
                  <div className={commonStyles.aggScore}>
                    <CountUp
                      start={0}
                      end={aggregateScore(quizScore)}
                      decimals={2}
                      onEnd={() => setShowShare(true)}
                      onStart={() => setShowShare(false)}
                    />
                  </div>
                  <div className={commonStyles.shareIcon} onClick={()=>setOpenShare(true)}>{showShare ? <ShareIcon color='success' fontSize='medium' /> : ''}</div>
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
                  onCancel={closePostDialog}
                  title="How to play"
                  content={
                    <>
                      <div className={commonStyles.helpText}>
                        {helpInfo(gameSettings)[1]}
                      </div>
                      <Image 
                        src={helpInfo(gameSettings)[0]}
                        width={350}
                        height='auto'
                        className={{'maxHeight': 'none'}}
                        sx={{
                          width: 'auto'
                        }}
                      />
                    </>
                  }
                  prompt="Start"
                  cancel={true}
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
                  ? <SingleMarker settings={gameSettings} title={title} timerStart={startTimer} showAlert={showAlert} getScore={getQuizScore} getTime={getQuizTime} endQuiz={closePostDialog} />
                  : gameSettings.type === 'multiple'
                      ? <MultipleMarker settings={gameSettings} title={title} timerStart={startTimer} showAlert={showAlert} getScore={getQuizScore} getTime={getQuizTime} endQuiz={closePostDialog} />
                      : <RestrictedMarker settings={gameSettings} title={title} timerStart={startTimer} showAlert={showAlert} getScore={getQuizScore} getTime={getQuizTime} endQuiz={closePostDialog} />
                  }
              </Wrapper>
            </>
          )}
        </>
    )
}

export default MapGuess;
