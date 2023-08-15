import HistoryItem from "./history-item";
import styles from "./styles/history-info.module.css";
import commonStyles from "./styles/common.module.css";
const HistoryInfo = ({ onClose }) => {
  return (
    <div className={styles.history}>
      <div className={styles.mainContainer}>
        <div className={commonStyles.header}>
          <div className={commonStyles.backLink} onClick={onClose}>&lt; Back</div>
          <div className={commonStyles.contentTitle}>Your history</div>
        </div>
        <div className={styles.mainContent}>
          <HistoryItem
            image="/unsplashc-zhkgezy3u@2x.png"
            date="Jul 20, 10:30"
            quizTitle="Famous Nigerians"
            points="1000 pt"
            badgeName="Gold"
            badgeIcon="/history-badge-icon@2x.png"
          />
          <HistoryItem
            image="/art1@2x.png"
            date="Jul 20, 10:30"
            quizTitle="Popular People"
            points="1000 pt"
            badgeName="Gold"
            badgeIcon="/history-badge-icon@2x.png"
          />
          <HistoryItem
            image="/unsplashc-zhkgezy3u@2x.png"
            date="Jul 20, 10:30"
            quizTitle="Banga Soup"
            points="1000 pt"
            badgeName="Gold"
            badgeIcon="/history-badge-icon@2x.png"
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryInfo;
