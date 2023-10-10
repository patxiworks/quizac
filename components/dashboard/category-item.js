import { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import Quizzes from "./quizzes";
import CategoriesContent from "./categories-content";
import PortalPopup from "./portal-popup";
import styles from "./styles/category-item.module.css";

const CategoryItem = ({ id, image, title, description, onClose }) => {
  const [isQuizzesPopupOpen, setQuizzesPopupOpen] = useState(false);

  const openQuizzesPopup = useCallback((item) => {
    setQuizzesPopupOpen(true);
  }, []);

  const closeQuizzesPopup = useCallback(() => {
    setQuizzesPopupOpen(false);
  }, []);

  const clickCategory = () => {
    setQuizzesPopupOpen(true);
  }

  return (
    <>
      <div className={styles.storyCard} onClick={clickCategory}>
        <Image className={styles.storyImageIcon} width={100} height={100} alt="" src={image} />
        <div className={styles.storyText}>
          <div className={styles.navTitle}>{title}</div>
          <div className={styles.text}>{description}</div>
        </div>
        <Image className={styles.navIcon} width={100} height={100} alt="" src="/nav-icon.svg" />
      </div>
      {isQuizzesPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0.7)"
          placement="Top left"
          onOutsideClick={false}
        >
          {/*<Quizzes catid={id} title={title} onClose={closeQuizzesPopup} />*/}
          <CategoriesContent category={id} onClose={closeQuizzesPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default CategoryItem;
