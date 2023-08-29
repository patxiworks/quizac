import Link from "next/link";
import Image from 'next/image';
import styles from "./styles/quiz-item.module.css";

const QuizItem = ({ image, title, description, url }) => {
  return (
    <div className={styles.storyBigCard}>
      <Image className={styles.loginArt} width={100} height={100} alt="" src={image} />
      <div className={styles.bigStoryBody}>
        <div className={styles.bigStoryItems}>
          <div className={styles.itemBox}>
            <div className={styles.itemTitle}>{title}</div>
            <div className={styles.itemDesc}>{description}</div>
          </div>
          <Link className={styles.playButton} href={url}>
            <div className={styles.playButtonChild} />
            <Image
              className={styles.playButtonItem}
              width={100} height={100}
              alt=""
              src="/polygon-1.svg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizItem;
