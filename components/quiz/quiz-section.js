import { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import { db, app } from '../../firebase';
import { doc, collection, getDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import { CircularProgress } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Categories from "../dashboard/categories";
import PortalPopup from "../dashboard/portal-popup";
import QuizFrame from "./quiz-frame";
import Quiz from "./quiz";
import { getCategories, getCategory, getTitles } from "@/data/fetch";
import styles from "./styles/quiz-section.module.css";

const QuizSection = ({ category, title }) => {
  const [startQuiz, setStartQuiz] = useState(false);
  const [quizCategory, setQuizCategory] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0); 
  const [isCategoriesPopupOpen, setCategoriesPopupOpen] = useState(false);

  const [categories, setCategories] = useState(null);
  const [titles, setTitles] = useState([]);
  const [visited, setVisited] = useState([]);
  const [nextTitle, setNextTitle] = useState('');
  const [prevTitle, setPrevTitle] = useState('');
  const mainContainer = "quiz";

  useEffect(() => {
    if (category) {
      getTitles(category, setTitles); // get titles
      getCategory(category, setQuizCategory); // set quizCategory
    }
  }, [category])

  useEffect(() => {
    // set nextTitle
    setVisited(prevVisited => [...prevVisited, title]);
    let rem = titles?.filter(i => !visited.includes(i.id) && i.id !== title);
    if (!rem.length) { setVisited([]); rem = titles; }
    //console.log(visited, rem)
    // get random item from titles array
    const randTitle = rem[(Math.floor(Math.random() * rem.length))];
    setNextTitle(randTitle?.id);

    // set quizTitle
    const arrQuizTitle = titles?.filter(t => t.id === title);
    setQuizTitle(arrQuizTitle && arrQuizTitle.length ? arrQuizTitle[0] : null);
  },[title, titles])

  const openCategoriesPopup = useCallback(() => {
    setCategoriesPopupOpen(true);
    const mainDiv = document.getElementById(mainContainer);
    mainDiv.style.position = "fixed";
  }, []);

  const closeCategoriesPopup = useCallback(() => {
    setCategoriesPopupOpen(false);
    const mainDiv = document.getElementById(mainContainer);
    mainDiv.style.position = "relative";
  }, []);

  const gac = (pos) => {
    return (
      quizTitle
      ? quizTitle === 'error'
        ? <div className={styles[pos]}><div className={styles.noAsset}>No asset found in the collection</div></div>
        : 
        <>
          <QuizFrame style={pos} type="asset" id={quizTitle.id+'?nzh'} fullscreen={true} />
        </>
      : <div className={styles[pos]}><CircularProgress /></div>
    )
  }

  const resetTotalScore = () => {
    setTotalScore(0); // Reset the total score
    setStartQuiz(true); // Start the quiz again
  };

  return (
    <>
      { quizCategory && quizTitle ?
      <div className={styles.mainSection}>
        <div className={styles.leftSection}>
          { gac('sideGacBox') }
        </div>
        <div className={styles.mainContent}>
          <div className={styles.topSection}>
            { gac('topGacBox') }
          </div>
          <div className={styles.pageNav}>
              <div className={styles.categoryName} onClick={openCategoriesPopup}>{quizCategory.name}</div>
              <Link href={`/quiz/${category}/${nextTitle}`}><ArrowCircleRightIcon fontSize="large" color="primary" className={styles.navIcon} /></Link>
          </div>
          <div className={styles.homeContent}>
            
            { quizCategory !== 'error' && quizTitle !== 'error' ?
              <>
              <div className={styles.contentTitle}>
                <div className={styles.titleColumn}>
                  <div>{quizTitle.title}</div>
                </div>
                <div className={styles.totalScore}>Total score: {totalScore}</div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.contentMessage}>
                {
                !startQuiz ?
                  <div className={styles.contentText}>
                    <p>{quizTitle.description}</p>
                    <button className={styles.startButton} onClick={()=>setStartQuiz(true)}>Start the quiz</button>
                  </div>
                  :
                  <Quiz
                    category={category}
                    title={title}
                    getScore={(score) => setTotalScore(totalScore + score)} 
                    onTryAgain={resetTotalScore}
                  />                }
                  <button
                    className={styles.startQuiz}
                    onClick={openCategoriesPopup}
                  >
                  </button>
                </div>
              </div>
              </>
            : 
            <>
              <div className={styles.contentTitle}>
                <div>Looks like you missed your way...</div>
              </div>
              <div className={styles.notFoundMessage}>No Quiz Found!</div>
            </>
            }
          </div>
        </div>
      </div>
      :
      <div className={styles.emptySection}><CircularProgress /></div>
      }
      {isCategoriesPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0.9)"
          placement="Top left"
          onOutsideClick={false}
        >
          <Categories onClose={closeCategoriesPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default QuizSection;