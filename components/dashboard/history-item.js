import Image from 'next/image';
import styles from "./styles/history-item.module.css";
const HistoryItem = ({
  image,
  date,
  quizTitle,
  points,
  badgeName,
  badgeIcon,
}) => {
  return (
    <div className={styles.historyCard}>
      <Image className={styles.historyImageIcon} width={100} height={100} alt="" src={image} />
      <div className={styles.historyInfo}>
        <div className={styles.historyDate}>{date}</div>
        <div className={styles.historyItem}>{quizTitle}</div>
        <div className={styles.historyRow}>
          <div className={styles.historyPoints}>{points}</div>
          <div className={styles.historyCellBadge}>
            <div className={styles.historyBadgeName}>{badgeName}</div>
            <Image className={styles.historyBadgeIcon} width={100} height={100} alt="" src={badgeIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;