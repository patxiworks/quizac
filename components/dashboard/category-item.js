import { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
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
        <Image className={styles.storyImageIcon} width={100} height={100} alt="" src={image} />
        <div className={styles.storyText}>
          <div className={styles.navTitle}>{title}</div>
          <div className={styles.text}>{description}</div>
        </div>
        <Image className={styles.navIcon} width={100} height={100} alt="" src="/nav-icon.svg" />
      </a>
      {isQuizzesPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0)"
          placement="Centered"
          onOutsideClick={false}
        >
          <Quizzes catid={id} title={title} onClose={closeQuizzesPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default CategoryItem;
