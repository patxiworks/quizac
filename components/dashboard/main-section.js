import { useState, useCallback } from "react";
import Categories from "./categories";
import PortalPopup from "./portal-popup";
import TypeDesktop from "./type-desktop1";
import QuizResultContainer from "./quiz-result-container";
import HistorySummary from "./history-summary";
import styles from "./styles/main-section.module.css";
const MainSection = () => {
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

  return (
    <>
      <div className={styles.mainSection}>
        <img className={styles.artIcon} alt="" src="/art@2x.png" />
        <div className={styles.mainContent}>
          <div className={styles.homeContent}>
            
              <img className={styles.artMobile} alt="" src="/art@2x.png" />
            
            <div className={styles.contentTitle}>Welcome back, Gerald!</div>
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
              <img className={styles.sepIcon} alt="" src="/sep2.svg" />
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

export default MainSection;
