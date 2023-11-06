import { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import Quizzes from "./quizzes";
import CategoriesContent from "./categories-content";
import SlideDrawer from "./drawer";
import PortalPopup from "./portal-popup";
import { getTitles } from "@/data/fetch";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import styles from "./styles/category-item.module.css";

const CategoryItem = ({ id, image, title, description, onClose }) => {
  const [titles, setTitles] = useState([]);

  // id is the category
  useEffect(() => {
    if (id) getTitles(id, setTitles);
  }, [id])

  return (
    <>
      <div className={styles.storyCard}>
        <Image className={styles.storyImageIcon} width={100} height={100} alt="" src={image} />
        <div className={styles.storyText}>
          <div className={styles.navTitle}>{title}</div>
          <div className={styles.text}>
            <div>{description}</div>
            <SlideDrawer anchor="left" label={<ArrowCircleRightIcon />}>
              <CategoriesContent category={id} titles={titles} popupTitle={`Choose from "${title}"`} />
            </SlideDrawer>
          </div>
        </div>
      </div>
      {/*isQuizzesPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0.7)"
          placement="Top left"
          onOutsideClick={false}
        >
          {/*<Quizzes catid={id} title={title} onClose={closeQuizzesPopup} />
          <CategoriesContent category={id} onClose={closeQuizzesPopup} />
        </PortalPopup>
      )*/}
    </>
  );
};

export default CategoryItem;
