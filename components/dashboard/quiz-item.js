import Link from "next/link";
import Image from 'next/image';
import styles from "./styles/quiz-item.module.css";

const QuizItem = ({ image, title, description, url, onClose }) => {
  return (
    <Link className={styles.playButton} href={url} onClick={onClose}>
      <div className={styles.storyBigCard}>
        <Image className={styles.loginArt} width={170} height={100} alt="" src={image} />
        <div className={styles.bigStoryBody}>
          <div className={styles.bigStoryItems}>
            <div className={styles.itemBox}>
              <div className={styles.itemTitle}>{title}</div>
              <div className={styles.itemDesc}>{description}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuizItem;
