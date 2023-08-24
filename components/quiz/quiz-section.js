import { useState, useEffect, useCallback } from "react";
import { db, app } from '../../firebase';
import { doc, collection, getDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import { CircularProgress } from '@mui/material';
import PortalPopup from "../dashboard/portal-popup";
import Quiz from "./quiz";
import styles from "./styles/quiz-section.module.css";

const QuizFrame = ( {style, type, id} ) => {
  return (
    <div className={styles[style]}>
      <iframe className={styles.gacFrame} src={`https://embed.culturalspot.org/embedv2/${type}/${id}`}></iframe>
    </div>
  )
}

const QuizSection = ({ category, title }) => {
  const [startQuiz, setStartQuiz] = useState(false);
  const [quizCategory, setQuizCategory] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [score, setScore] = useState(0);
  const [isCategoriesPopupOpen, setCategoriesPopupOpen] = useState(false);
  const mainContainer = "dashboard";

  useEffect(() => {
    async function fetchData(path, setData) {
      try {
        const docRef = doc(db, path);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setData('error');
        }
      } catch(e) {
        console.log(e)
        // redirect to dashboard?
      }
    } 
    if (category && title) {
      fetchData(`quizzQuestions/${category}`, setQuizCategory);
      fetchData(`quizzQuestions/${category}/titles/${title}`, setQuizTitle);
    }
  }, [category, title]);

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
        : <QuizFrame style={pos} type="asset" id={quizTitle.gacId+'?nzh'} />
      : <div className={styles[pos]}><CircularProgress /></div>
    )
  }

  return (
    <>
      { quizCategory && quizTitle ?
      <div className={styles.mainSection}>
        { gac('sideGacBox') }
        <div className={styles.mainContent}>
          <div className={styles.homeContent}>
            { gac('topGacBox') }
            { quizCategory !== 'error' && quizTitle !== 'error' ?
              <>
              <div className={styles.contentTitle}>
                <div>{quizCategory.name}: {quizTitle.name}</div>
                <div>Total score: {score}</div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.contentMessage}>
                {
                !startQuiz ?
                  <div className={styles.contentText}>
                    <p>Lorem ipsum dolor sit amet consectetur. Magnis integer quis
                    faucibus neque sit pulvinar ac quis mauris. Sed at sit
                    elementum nulla sit non augue orci nisi. Fermentum eget eget
                    nunc convallis a phasellus. Quis metus sed donec cursus id
                    adipiscing mauris.</p>
                    <button className={styles.startButton} onClick={()=>setStartQuiz(true)}>Start the quiz</button>
                  </div>
                  :
                  <Quiz category={category} title={title} getScore={setScore} />
                }
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
          placement="Centered"
          onOutsideClick={false}
        >
          <Categories onClose={closeCategoriesPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default QuizSection;
