import { useState, useCallback, useEffect } from "react";
import Image from 'next/image';
import Categories from "./categories";
import PortalPopup from "./portal-popup";
import TypeDesktop from "./type-desktop1";
import QuizFrame from "../quiz/quiz-frame";
import QuizResultContainer from "./quiz-result-container";
import HistorySummary from "./history-summary";
import styles from "./styles/main-section.module.css";
import { useRouter } from 'next/router';
import { getAuth, signInAnonymously } from 'firebase/auth';
import app from '../../firebase';

const MainSection = ({ categories }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const [isCategoriesPopupOpen, setCategoriesPopupOpen] = useState(false);
  const mainContainer = "dashboard";

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

  useEffect(() => {
    const auth = getAuth(app);
    auth.onAuthStateChanged(async user => {
      if (user) {
        setIsAuthenticated(true);
        await setDisplayName(user.displayName || '');
      } else {
        setIsAuthenticated(false);
        setDisplayName('Guest');
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && !displayName) {
      setDisplayName('Guest');
    }
  }, [isAuthenticated, displayName]);

  return (
    <>
      <div className={styles.mainSection}>
        <QuizFrame style='sideGacBox' type="asset" id="eQHH3QrjkD0OUQ?nzh" fullscreen={false} />
        <div className={styles.mainContent}>
          <div className={styles.homeContent}>
            <QuizFrame style='topGacBox' type="asset" id="eQHH3QrjkD0OUQ?nzh" fullscreen={false} />
            <div className={styles.contentTitle}> Welcome back, {isAuthenticated ? displayName : 'Guest'} </div>
             <div className={styles.contentBox}>
              <div className={styles.contentMessage}>
                <div className={styles.contentText}>
                  Lorem ipsum dolor sit amet consectetur. Magnis integer quis
                  faucibus neque sit pulvinar ac quis mauris. Sed at sit
                  elementum nulla sit non augue orci nisi. Fermentum eget eget
                  nunc convallis a phasellus. Quis metus sed donec cursus id
                  adipiscing mauris.
                </div>
                <button
                  className={styles.startQuiz}
                  onClick={openCategoriesPopup}
                >
                  <TypeDesktop
                    signInText="Start a quiz"
                    typeDesktopPosition="unset"
                    typeDesktopWidth="unset"
                    typeDesktopBoxSizing="border-box"
                    typeDesktopCursor="pointer"
                    typeDesktopBorder="none"
                    typeDesktopAlignSelf="stretch"
                    signInDisplay="inline-block"
                    signInFlex="1"
                  />
                </button>
              </div>
              <Image className={styles.sepIcon} width={100} height={100} alt="" src="/sep2.svg" />
              <div className={styles.summaryInfo}>
                <div className={styles.summaryBox}>
                  <QuizResultContainer
                    icon="/antdesignflagfilled.svg"
                    value="27"
                    message="Correct answers"
                  />
                  <QuizResultContainer
                    icon="/antdesignflagfilled1.svg"
                    value="27"
                    message="Quiz Passed"
                    //propWidth="96px"
                  />
                  <QuizResultContainer
                    icon="/antdesignflagfilled2.svg"
                    value="27m"
                    message="Fastest time"
                    //propWidth="98px"
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      {categories && isCategoriesPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0.9)"
          placement="Top left"
          onOutsideClick={false}
        >
          <Categories categories={categories} onClose={closeCategoriesPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default MainSection;
