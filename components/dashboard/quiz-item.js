import styles from "./styles/quiz-item.module.css";
const QuizItem = ({ image, title, description }) => {
  return (
    <div className={styles.storyBigCard}>
      <img className={styles.loginArt} alt="" src={image} />
      <div className={styles.bigStoryBody}>
        <div className={styles.bigStoryItems}>
          <div className={styles.itemBox}>
            <div className={styles.itemTitle}>{title}</div>
            <div className={styles.itemDesc}>{description}</div>
          </div>
          <button className={styles.playButton}>
            <div className={styles.playButtonChild} />
            <img
              className={styles.playButtonItem}
              alt=""
              src="/polygon-1.svg"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizItem;
