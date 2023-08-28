import { useState, useCallback, useEffect } from "react";
import Image from 'next/image';
import Categories from "./categories";
import PortalPopup from "./portal-popup";
import TypeDesktop from "./type-desktop1";
import QuizResultContainer from "./quiz-result-container";
import HistorySummary from "./history-summary";
import styles from "./styles/main-section.module.css";
import { useRouter } from 'next/router';
const GacFrame = ( {style, type, id} ) => {
  return (
    <div className={styles[style]}>
      <iframe className={styles.gacFrame} src={`https://embed.culturalspot.org/embedv2/${type}/${id}`}></iframe>
    </div>
  )
}

const MainSection = ({ categories }) => {
  const router = useRouter();
  const { displayName } = router.query;
  const storedDisplayName = localStorage.getItem('displayName') || '';

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
    if (storedDisplayName) {
      router.query.displayName = storedDisplayName;
    }
  }, [storedDisplayName]);

  return (
    <>
      <div className={styles.mainSection}>
        <GacFrame style='sideGacBox' type="asset" id="eQHH3QrjkD0OUQ?nzh" />
        <div className={styles.mainContent}>
          <div className={styles.homeContent}>
            <GacFrame style='topGacBox' type="asset" id="eQHH3QrjkD0OUQ?nzh" />
            <div className={styles.contentTitle}>Welcome back,{storedDisplayName || displayName}! </div>
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
          placement="Centered"
          onOutsideClick={false}
        >
          <Categories categories={categories} onClose={closeCategoriesPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default MainSection;
