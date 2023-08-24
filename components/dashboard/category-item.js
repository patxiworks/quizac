import { useState, useCallback } from "react";
import Quizzes from "./quizzes";
import PortalPopup from "./portal-popup";
import styles from "./styles/category-item.module.css";

const CategoryItem = ({ id, image, title, description }) => {
  const [isQuizzesPopupOpen, setQuizzesPopupOpen] = useState(false);

  const openQuizzesPopup = useCallback((item) => {
    setQuizzesPopupOpen(true);
  }, []);

  const closeQuizzesPopup = useCallback(() => {
    setQuizzesPopupOpen(false);
  }, []);

  return (
    <>
      <a className={styles.storyCard} onClick={openQuizzesPopup}>
        <img className={styles.storyImageIcon} alt="" src={image} />
        <div className={styles.storyText}>
          <div className={styles.navTitle}>{title}</div>
          <div className={styles.text}>{description}</div>
        </div>
        <img className={styles.navIcon} alt="" src="/nav-icon.svg" />
      </a>
      {isQuizzesPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0)"
          placement="Centered"
          onOutsideClick={false}
        >
          <Quizzes onClose={closeQuizzesPopup} category={title} />
        </PortalPopup>
      )}
    </>
  );
};

export default CategoryItem;
